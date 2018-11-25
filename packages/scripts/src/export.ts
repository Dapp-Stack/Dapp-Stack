import * as wallet from '@dapp-stack/wallet'

import { globalError } from './shared/globalError'

try {
  wallet.exportPrivateKey()
} catch (error) {
  globalError(error)
}
