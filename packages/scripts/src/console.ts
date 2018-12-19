import * as ethereum from '@dapp-stack/ethereum'
import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

async function consoleAsync() {
  try {
    await ethereum.start()
    ethereum.console()
    lifecycle.after()
  } catch (error) {
    globalError(error)
  }
}

consoleAsync()
