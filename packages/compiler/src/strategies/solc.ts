import { Artifact } from '@dapp-stack/contract-utils'
import { Structure } from '@dapp-stack/environment'
import { FunctionFragment } from 'ethers/utils/abi-coder'
import * as fs from 'fs-extra'
import { forEach } from 'lodash'
import * as path from 'path'
import { Signale } from 'signale'
import * as solc from 'solc'

import { ICompileStrategy } from '../types'

interface CompilationResult {
  evm: {
    bytecode: {
      object: string
      sourceMap: string
    }
    deployedBytecode: {
      object: string
      sourceMap: string
    }
  }
  abi: FunctionFragment[]
}

interface CompilationOutput {
  errors?: [
    {
      severity: string
    }
  ]
  contracts: {
    [sourcePath: string]: {
      [contractName: string]: CompilationResult
    }
  }
}

export class Solc implements ICompileStrategy {
  private readonly contracts: string[]
  private readonly signale: Signale

  constructor(contracts: string[], signale: Signale) {
    this.contracts = contracts
    this.signale = signale
  }

  private input = (): string => {
    const sources = this.contracts.reduce(
      (acc: { [filepath: string]: { content: string } }, filepath) => {
        if (!fs.existsSync(filepath)) {
          this.signale.error(`File not found: ${filepath}`)
          return acc
        }
        acc[filepath] = {
          content: fs.readFileSync(filepath, 'utf-8').toString()
        }
        return acc
      },
      {}
    )

    return JSON.stringify({
      language: 'Solidity',
      sources,
      settings: {
        outputSelection: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          '*': {
            '*': [
              'abi',
              'ast',
              'devdoc',
              'userdoc',
              'metadata',
              'evm.gasEstimates',
              'evm.assembly',
              'evm.bytecode.object',
              'evm.bytecode.sourceMap',
              'evm.deployedBytecode.object',
              'evm.deployedBytecode.sourceMap'
            ]
          }
        }
      }
    })
  }

  private findImports(filename: string) {
    if (fs.existsSync(filename)) {
      return { contents: fs.readFileSync(filename).toString() }
    }

    if (fs.existsSync(path.join('./node_modules/', filename))) {
      return {
        contents: fs
          .readFileSync(path.join('./node_modules/', filename))
          .toString()
      }
    }
    if (fs.existsSync(path.join(Structure.contracts.src, filename))) {
      return {
        contents: fs
          .readFileSync(path.join(Structure.contracts.src, filename))
          .toString()
      }
    }
    return { error: 'File not found' }
  }

  private buildArtifact(
    sourcePath: string,
    contractName: string,
    result: CompilationResult
  ): Artifact {
    return {
      contractName,
      abi: result.abi,
      source: fs.readFileSync(sourcePath, 'utf-8'),
      sourcePath,
      bytecode: result.evm.bytecode.object,
      sourceMap: result.evm.bytecode.sourceMap,
      deployedBytecode: result.evm.deployedBytecode.object,
      deployedSourceMap: result.evm.deployedBytecode.sourceMap
    }
  }

  compile = () => {
    this.signale.await('Starting to compile the solidity contracts')
    return new Promise<boolean>(resolve => {
      const output: CompilationOutput = JSON.parse(
        solc.compile(this.input(), this.findImports)
      )

      if (output.errors) {
        const hasError =
          output.errors.filter(error => error.severity === 'error').length > 0
        if (hasError) {
          this.signale.error('Compilation failed:')
          this.signale.error(output.errors)
          return resolve(false)
        } else {
          this.signale.error('Compiled with warning:')
          this.signale.error(output.errors)
        }
      }

      forEach(output.contracts, (compilationResult, sourcePath) => {
        const buildPath = sourcePath.replace(
          Structure.contracts.src,
          Structure.contracts.build
        )
        fs.ensureDirSync(buildPath)

        forEach(compilationResult, (result, contractName) => {
          const artifact = this.buildArtifact(sourcePath, contractName, result)

          fs.writeFileSync(
            path.join(buildPath, `${contractName}.json`),
            JSON.stringify(artifact, null, 2),
            'utf-8'
          )
        })
      })
      this.signale.success('Contracts compiled')
      resolve(true)
    })
  }
}
