#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from './shared/blockchain';
import { compileAll } from './shared/compile';
import { deploy } from './shared/deploy';
import { validateEnvironment } from './shared/environment';
import * as lifecycle from './shared/lifecycle';
import * as storage from './shared/storage';
import { watch } from './shared/watch';
import { startWeb } from './shared/web';

const environment = lifecycle.before();

async function startAsync() {
  await validateEnvironment(environment);
  await blockchain.start(environment);
  await storage.startIpfsAsync(environment);
  compileAll(environment);
  deploy(environment);
  watch(environment);
  startWeb();
}

startAsync();

lifecycle.after(environment);
