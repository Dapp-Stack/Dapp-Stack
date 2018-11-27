import { build, Maybe } from '@dapp-stack/environment'
import { Signale } from 'signale'

import { Solc } from './strategies/solc'

const signale = new Signale({ scope: 'Compiler' })

export const run = (contracts: Maybe<string[]> = false): Promise<boolean> => {
  if (!contracts) {
    contracts = build().compile.contracts
  }

  const solcContracts = contracts.filter(contractName =>
    contractName.endsWith('.sol')
  )
  return new Solc(solcContracts, signale).compile()
}
