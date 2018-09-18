#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from '@solon/blockchain';
import * as storage from '@solon/storage';
import * as compiler from '@solon/compiler';
import { Deployer } from '@solon/deployer';
import { generateDocs } from '@solon/doc';

import * as lifecycle from './shared/lifecycle';

import { watch } from './shared/watch';
import { startWeb } from './shared/web';

const environment = lifecycle.before();

async function startAsync() {
  await blockchain.start(environment.services.blockchain);
  await storage.start(environment.services.storage);
  generateDocs(environment.compile)
  await compiler.run(environment.compile);
  await new Deployer(environment.deploy).run();
  watch(environment);
  // startWeb();
}

startAsync();

lifecycle.after(environment);
