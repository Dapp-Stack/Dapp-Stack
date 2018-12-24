import { Maybe } from '@dapp-stack/environment'
import {
  sourcesPath,
  solidityFilter,
  vyperFilter
} from '@dapp-stack/contract-utils'
import { Signale } from 'signale'

import { Solc } from './strategies/solc'
import { Vyper } from './strategies/vyper'

const signale = new Signale({ scope: 'Compiler' })

export const run = async (contracts: Maybe<string[]> = false) => {
  const solcContracts = sourcesPath().filter(solidityFilter)
  const vyperContracts = sourcesPath().filter(vyperFilter)

  if (solcContracts.length) {
    const solc = new Solc(solcContracts, signale)
    await solc.compile()
  }

  if (vyperContracts.length) {
    const vyper = new Vyper(vyperContracts, signale)
    await vyper.compile()
  }
}
