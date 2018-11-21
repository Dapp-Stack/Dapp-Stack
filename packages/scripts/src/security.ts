#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err
})

import * as security from '@dapp-stack/security'

import { globalError } from './shared/globalError'

security.run().then().catch(globalError)
