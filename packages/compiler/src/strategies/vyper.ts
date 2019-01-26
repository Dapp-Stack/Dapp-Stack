import { Artifact } from '@dapp-stack/contract-utils'
import { Structure } from '@dapp-stack/environment'
import * as child_process from 'child_process'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'
import * as spawn from 'cross-spawn'

import { ICompileStrategy } from '../types'

export class Vyper implements ICompileStrategy {
  private readonly contracts: string[]
  private readonly signale: Signale
  private child!: child_process.ChildProcess

  constructor(contracts: string[], signale: Signale) {
    this.contracts = contracts
    this.signale = signale
  }

  private commandArgs = () => {
    return ['-f=combined_json'].concat(this.contracts)
  }

  private buildArtifact(
    sourcePath: string,
    contractName: string,
    result: any
  ): Artifact {
    return {
      contractName,
      abi: result.abi,
      source: fs.readFileSync(sourcePath, 'utf-8'),
      sourcePath,
      bytecode: result.bytecode,
      deployedBytecode: result.runtimeBytecode
    }
  }

  private writeResults(results: string) {
    const compiledContracts = JSON.parse(results)
    Object.keys(compiledContracts).forEach((sourcePath: string) => {
      if (sourcePath === 'version') {
        return
      }

      const buildPath = sourcePath.replace(
        Structure.contracts.src,
        Structure.contracts.build
      )

      fs.ensureDirSync(buildPath)

      const contractName = sourcePath
        .replace(Structure.contracts.src, '')
        .replace('.vy', '.json')

      const artifact = this.buildArtifact(
        sourcePath,
        contractName,
        compiledContracts[sourcePath]
      )

      fs.writeFileSync(
        path.join(buildPath, `${contractName}.json`),
        JSON.stringify(artifact, null, 2),
        'utf-8'
      )
    })
  }

  compile = () => {
    this.signale.await('Starting to compile the vyper contracts')
    return new Promise<boolean>(resolve => {
      let results = ''
      this.child = spawn('vyper', this.commandArgs(), { stdio: 'pipe' })
      this.child.stderr.on('data', (data: Buffer) => {
        data
          .toString('utf-8')
          .trim()
          .split('\n')
          .forEach(line => this.signale.error(line))
      })
      this.child.stdout.on('data', (data: Buffer) => {
        results += data.toString('utf-8').trim()
      })

      this.child.on('exit', () => {
        this.writeResults(results)
        this.signale.success('Contracts compiled')
        resolve(true)
      })
    })
  }
}
