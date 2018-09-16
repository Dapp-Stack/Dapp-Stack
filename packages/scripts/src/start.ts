#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from '@solon/blockchain';
import * as compiler from '@solon/compiler';
// import * as deployer from '@solon/deployer';
import * as storage from '@solon/storage';

import * as lifecycle from './shared/lifecycle';

// import { watch } from './shared/watch';
// import { startWeb } from './shared/web';


const environment = lifecycle.before();

async function startAsync() {
  await blockchain.start(environment.services.blockchain);
  await storage.start(environment.services.storage);
  await compiler.run(environment.compile);
  // await deployer.run(environment.deploy)
  // watch(environment);
  // startWeb();
}

startAsync();

lifecycle.after(environment);
