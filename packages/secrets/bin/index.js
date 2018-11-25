#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err
})

require('../dist/src/cli.js')