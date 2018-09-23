#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from '@solon/blockchain';
import * as storage from '@solon/storage';
import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';
import * as doc from '@solon/doc';

import * as lifecycle from './shared/lifecycle';

import { buildWeb } from './shared/web';

const environment = lifecycle.before();

async function buildAsync() {
  await blockchain.start(environment.services.blockchain);
  await storage.start(environment.services.storage);
  await compiler.run(environment.compile);
  doc.runAll(environment.compile);
  await deployer.run(environment.deploy)
  await buildWeb();
  await lifecycle.stopAsync(environment, {shouldExit: true});
}

buildAsync();