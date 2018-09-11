#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { compileAll } from './shared/compile';
import { deploy } from './shared/deploy';
import { watch } from './shared/watch';
import { startWeb } from './shared/web';
import { generateWalletAsync } from './shared/wallet';
import * as services from './shared/services';
import * as lifecycle from './shared/lifecycle';
import { validateEnvironment } from './shared/environment';

const environment = lifecycle.before();

async function startAsync() {
  await validateEnvironment(environment);
  await services.startGethAsync(environment);
  await services.startIpfsAsync(environment);
  await generateWalletAsync(environment);
  compileAll(environment);
  deploy(environment);
  watch(environment);
  startWeb();
}

startAsync();

lifecycle.after();