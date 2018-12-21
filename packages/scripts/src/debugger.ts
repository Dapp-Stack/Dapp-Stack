import * as debug from '@dapp-stack/debugger'
import * as ethereum from '@dapp-stack/ethereum'
import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

export async function start(txHash: string) {
  try {
    await ethereum.start()
    lifecycle.after()
    debug.start(txHash)
  } catch (error) {
    globalError(error)
  }
}
