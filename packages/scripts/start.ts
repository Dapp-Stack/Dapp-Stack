#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as ethereum from '@solon/ethereum';
import * as storage from '@solon/storage';
import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';
import * as doc from '@solon/doc';

import * as lifecycle from './shared/lifecycle';

import { watch } from './shared/watch';
import { startWeb } from './shared/web';

const environment = lifecycle.before();

async function startAsync() {
  await ethereum.start(environment.services.ethereum);
  await storage.start(environment.services.storage);
  await compiler.run(environment.compile);
  doc.runAll(environment.compile);
  await deployer.run(environment.deploy);
  watch(environment);
  startWeb();
}

startAsync();

lifecycle.after(environment);
