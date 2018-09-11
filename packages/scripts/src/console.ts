#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { generateWalletAsync } from './shared/wallet';
import * as services from './shared/services';
import * as lifecycle from './shared/lifecycle';
import { validateEnvironment } from './shared/environment';

const environment = lifecycle.before();

async function consoleAsync() {
  await validateEnvironment(environment);
  await services.startConsoleAsync(environment);
}

consoleAsync();

lifecycle.after();