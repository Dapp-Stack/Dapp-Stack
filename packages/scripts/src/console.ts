import * as ethereum from '@dapp-stack/ethereum'
import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

async function startConsole() {
  try {
    await ethereum.start()
    ethereum.console()
  } catch (error) {
    globalError(error)
  }
}

startConsole()
  .then()
  .catch()
lifecycle.after()
