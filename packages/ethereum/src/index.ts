import {
  build,
  EthereumNetwork,
  Maybe,
  Ethereum
} from '@dapp-stack/environment'
import { Signale } from 'signale'

import { Geth } from './strategies/geth'
import { Infura } from './strategies/infura'
import { Null } from './strategies/null'
import { IEthereumStrategy } from './types'

const signale = new Signale({ scope: 'Ethereum' })

const migrate = () => new Promise<void>(resolve => resolve())

const strategy = (network: Maybe<EthereumNetwork>): IEthereumStrategy => {
  let ethereum: Maybe<Ethereum>
  if (network) {
    ethereum = { network, migrate }
  } else {
    ethereum = build().ethereum
  }

  if (!ethereum || ethereum.network === 'external') return new Null()

  switch (ethereum.network) {
    case 'dev':
      return new Geth(ethereum, signale)
    default:
      return new Infura(ethereum, signale)
  }
}

export const console = (network: Maybe<EthereumNetwork> = false) => {
  let ethereum: Maybe<Ethereum>
  if (network) {
    ethereum = { network, migrate }
  } else {
    ethereum = build().ethereum
  }

  if (!ethereum) {
    return signale.error(
      'This command is only available when using the ethereum network'
    )
  }

  new Geth(ethereum, signale).console()
}

export const start = (
  network: Maybe<EthereumNetwork> = false
): Promise<boolean> => {
  return strategy(network).start()
}

export const stop = (
  network: Maybe<EthereumNetwork> = false
): Promise<boolean> => {
  return strategy(network).stop()
}
