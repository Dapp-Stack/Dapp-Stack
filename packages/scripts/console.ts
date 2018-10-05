#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as ethereum from '@solon/ethereum';
import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

async function consoleAsync() {
  await ethereum.console(environment.services.ethereum);
}

consoleAsync();
