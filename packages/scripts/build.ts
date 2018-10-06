#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as ethereum from '@solon/ethereum';
import * as ipfs from '@solon/ipfs';
import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';
import * as doc from '@solon/doc';

import * as lifecycle from './shared/lifecycle';

import { buildWeb } from './shared/web';

async function buildAsync() {
  await ethereum.start();
  await ipfs.start();
  await compiler.run();
  doc.runAll();
  await deployer.run();
  await buildWeb();
  await lifecycle.stopAsync({ shouldExit: true });
}

buildAsync();
