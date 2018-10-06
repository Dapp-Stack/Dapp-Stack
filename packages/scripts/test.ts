#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as ethereum from '@solon/ethereum';
import * as tester from '@solon/test';
import * as ipfs from '@solon/ipfs';
import * as compiler from '@solon/compiler';
import { testWeb } from './shared/web';
import * as lifecycle from './shared/lifecycle';

async function testAsync() {
  await ethereum.start();
  await ipfs.start();
  await compiler.run();
  await tester.run();
  process.exit();
}

const command = process.argv[2];
if (command === 'web') {
  testWeb();
} else if (command === 'contract') {
  testAsync();
  lifecycle.after();
}
