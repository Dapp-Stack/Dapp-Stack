#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as blockchain from '@solon/blockchain';
import * as storage from '@solon/storage';
import * as compiler from '@solon/compiler';
import { Deployer } from '@solon/deployer';

import * as lifecycle from './shared/lifecycle';

import { buildWeb } from './shared/web';

const environment = lifecycle.before();

async function buildAsync() {
  await blockchain.start(environment.services.blockchain);
  await storage.start(environment.services.storage);
  await compiler.run(environment.compile);
  await new Deployer(environment.deploy).run();
  buildWeb();
  lifecycle.stopAsync(environment);
}

buildAsync();