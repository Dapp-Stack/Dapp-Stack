#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err
})

import * as compiler from '@dapp-stack/compiler'
import * as tester from '@dapp-stack/test'
import * as web from '@dapp-stack/web'
import * as ethereum from '@dapp-stack/ethereum'
import * as ipfs from '@dapp-stack/ipfs'

import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

process.env.DAPP_ENV = 'test'

const shouldRunCoverage = process.env.COVERAGE

async function testAsync () {
  await ethereum.start()
  await ipfs.start()
  if (shouldRunCoverage) {
    await compiler.run()
    tester.setupCoverage()
  }
  await compiler.run()
  tester.run()
  if (shouldRunCoverage) {
    tester.finishCoverage()
  }
  await lifecycle.stopAsync({ shouldExit: true })
}

const command = process.argv[2]

if (command === 'web') {
  web.test()
} else if (command === 'contract') {
  testAsync().then().catch(globalError)
  lifecycle.after()
}
