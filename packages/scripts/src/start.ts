import * as compiler from '@dapp-stack/compiler'
import * as deployer from '@dapp-stack/deployer'
import * as doc from '@dapp-stack/doc'
import * as ethereum from '@dapp-stack/ethereum'
import * as ipfs from '@dapp-stack/ipfs'
import * as web from '@dapp-stack/web'
import * as api from '@dapp-stack/api'

import * as lifecycle from './shared/lifecycle'
import { watch } from './shared/watch'
import { globalError } from './shared/globalError'

async function startAsync() {
  try {
    await ethereum.start()
    await ipfs.start()
    await api.start()
    await compiler.run()
    doc.runAll()
    await deployer.run()
    watch()
    web.start()
  } catch (error) {
    globalError(error)
  }
}

startAsync()
  .then()
  .catch()
lifecycle.after()
