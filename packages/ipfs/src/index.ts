import { build } from '@dapp-stack/environment'
import { Signale } from 'signale'

import { Go } from './strategies/go'
import { Null } from './strategies/null'
import { IIpfsStrategy } from './types'

const signale = new Signale({ scope: 'Ipfs' })

const strategy = (force: boolean): IIpfsStrategy => {
  if (!force) {
    const enabled = build().ipfs
    if (!enabled) return new Null()
  }

  return new Go(signale)
}

export const start = (force: boolean = false): Promise<boolean> => {
  return strategy(force).start()
}

export const stop = (force: boolean = false): Promise<boolean> => {
  return strategy(force).stop()
}
