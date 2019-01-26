import {
  Maybe,
  Solidity,
  Optimizer,
  build,
  Structure
} from '@dapp-stack/environment'
import { solidityContracts, vyperContracts } from '@dapp-stack/contract-utils'
import * as fs from 'fs-extra'
import { Signale } from 'signale'
import { PluginManager } from 'live-plugin-manager'

import { Solc } from './strategies/solc'
import { Vyper } from './strategies/vyper'

const signale = new Signale({ scope: 'Compiler' })

const downloadVersion = async (version: string) => {
  signale.await(`Starting to download solc ${version}`)
  const manager = new PluginManager({ pluginsPath: `${process.cwd()}/.solcVersions/${version}`})
  await manager.install('solc', version)
  signale.success(`Finished to download solc ${version}`)
  return manager.require('solc')
}

export const run = async (
  solidityArg: Maybe<Solidity> = false,
  vyperArg: Maybe<string[]> = false,
  options: Maybe<Optimizer> = false
) => {
  await fs.emptyDir(Structure.contracts.build)

  const solidity = solidityArg || solidityContracts()
  const vyper = vyperArg || vyperContracts()
  const optimizer = options || build().compile.optimizer

  for (const version in solidity) {
    const solcCompiler = await downloadVersion(version)
    const solc = new Solc(solcCompiler, solidity[version], optimizer, signale)
    await solc.compile()
  }

  if (vyper.length) {
    const vy = new Vyper(vyper, signale)
    await vy.compile()
  }
}
