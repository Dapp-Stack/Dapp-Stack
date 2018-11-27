import * as ethereum from '@dapp-stack/ethereum'
import { globalError } from './shared/globalError'

function consoleAsync() {
  try {
    ethereum.console()
  } catch (error) {
    globalError(error)
  }
}

consoleAsync()
