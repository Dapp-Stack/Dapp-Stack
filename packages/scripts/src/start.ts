#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';
import * as doc from '@solon/doc';
import * as ethereum from '@solon/ethereum';
import * as ipfs from '@solon/ipfs';
import * as web from '@solon/web';

import * as lifecycle from './shared/lifecycle';
import { watch } from './shared/watch';

async function startAsync() {
  await ethereum.start();
  await ipfs.start();
  await compiler.run();
  doc.runAll();
  await deployer.run();
  watch();
  web.start();
}

startAsync();

lifecycle.after();
