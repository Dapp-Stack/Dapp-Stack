import * as compiler from '@dapp-stack/compiler'
import * as tester from '@dapp-stack/test'
import * as ethereum from '@dapp-stack/ethereum'
import * as ipfs from '@dapp-stack/ipfs'

import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

process.env.DAPP_ENV = 'test'

async function testAsync() {
  await ethereum.start()
  await ipfs.start()
  await tester.setupCoverage()
  await compiler.run()
  tester.run()
  await tester.finishCoverage()
  await lifecycle.stopAsync({ shouldExit: true })
}

testAsync()
  .then()
  .catch(globalError)
