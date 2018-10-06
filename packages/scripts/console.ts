#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as ethereum from '@solon/ethereum';

async function consoleAsync() {
  await ethereum.console();
}

consoleAsync();
