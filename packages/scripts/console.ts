#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from '@solon/blockchain';
import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

async function consoleAsync() {
  await blockchain.console(environment.services.blockchain);
}

consoleAsync();