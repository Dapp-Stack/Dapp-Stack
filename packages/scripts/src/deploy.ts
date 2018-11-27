import * as compiler from '@dapp-stack/compiler'
import * as deployer from '@dapp-stack/deployer'
import * as doc from '@dapp-stack/doc'
import * as ethereum from '@dapp-stack/ethereum'
import * as web from '@dapp-stack/web'

import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

async function buildAsync() {
  try {
    await ethereum.start()
    await compiler.run()
    doc.runAll()
    await deployer.run()
    await web.build()
    await web.deploy()
    await lifecycle.stopAsync({ shouldExit: true })
  } catch (error) {
    globalError(error)
  }
}

buildAsync()
  .then()
  .catch()
lifecycle.after()
