import { Ethereum } from '@dapp-stack/environment'
import { Signale } from 'signale'

import { IEthereumStrategy } from '../types'

export class Infura implements IEthereumStrategy {
  private readonly config: Ethereum
  private readonly signale: Signale

  constructor(config: Ethereum, signale: Signale) {
    this.config = config
    this.signale = signale
  }

  start = () => {
    return new Promise<boolean>(resolve => {
      this.signale.success('Connected to infura.')
      resolve(true)
    })
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      resolve(true)
    })
  }
}
