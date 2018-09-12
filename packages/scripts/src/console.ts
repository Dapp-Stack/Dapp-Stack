#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from './shared/blockchain';
import { validateEnvironment } from './shared/environment';
import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

async function consoleAsync() {
  await validateEnvironment(environment);
  await blockchain.startConsole(environment);
}

consoleAsync();

lifecycle.after(environment);
