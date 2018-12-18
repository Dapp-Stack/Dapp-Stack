import * as child_process from 'child_process'
import { Compile, Structure } from '@dapp-stack/environment'
import * as fs from 'fs-extra'
import { forEach } from 'lodash'
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

  commandArgs = () => {
    const contractsFilepath = this.contracts.map(contract =>
      path.join(Structure.contracts.src, contract)
    )
    return ['-f=combined_json'].concat(contractsFilepath)
  }

  writeResults(results: string) {
    const compiledContracts = JSON.parse(results)
    Object.keys(compiledContracts).forEach((filepath: string) => {
      if (filepath === 'version') {
        return
      }
      const dir = filepath.replace(
        Structure.contracts.src,
        Structure.contracts.build
      )
      const filename = filepath
        .replace(Structure.contracts.src, '')
        .replace('.vy', '.json')

      compiledContracts[filepath]['evm'] = {
        bytecode: { object: compiledContracts[filepath].bytecode.substring(2) }
      }

      fs.ensureDirSync(dir)
      fs.writeJSONSync(path.join(dir, filename), compiledContracts[filepath])
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
