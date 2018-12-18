import { build, Maybe } from '@dapp-stack/environment'
import { Signale } from 'signale'

import { Solc } from './strategies/solc'
import { Vyper } from './strategies/vyper'

const signale = new Signale({ scope: 'Compiler' })

export const run = async (contracts: Maybe<string[]> = false) => {
  if (!contracts) {
    contracts = build().compile.contracts
  }

  const solcContracts = contracts.filter(contractName =>
    contractName.endsWith('.sol')
  )

  const vyperContracts = contracts.filter(contractName =>
    contractName.endsWith('.vy')
  )

  if (solcContracts.length) {
    const solc = new Solc(solcContracts, signale)
    await solc.compile()
  }

  if (vyperContracts.length) {
    const vyper = new Vyper(vyperContracts, signale)
    await vyper.compile()
  }
}
