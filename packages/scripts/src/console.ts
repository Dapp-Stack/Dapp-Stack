#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { generateWalletAsync } from './shared/wallet';
import * as blockchain from './shared/blockchain';
import * as lifecycle from './shared/lifecycle';
import { validateEnvironment } from './shared/environment';

const environment = lifecycle.before();

async function consoleAsync() {
  await validateEnvironment(environment);
  await blockchain.startConsole(environment);
}

consoleAsync();

lifecycle.after(environment);