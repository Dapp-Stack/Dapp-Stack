#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { Environment } from '@solon/environment';
import * as ethereum from '@solon/ethereum';
import * as tester from '@solon/test';
import * as storage from '@solon/storage';
import * as compiler from '@solon/compiler';
import { testWeb } from './shared/web';
import * as lifecycle from './shared/lifecycle';

async function testAsync(environment: Environment) {
  await ethereum.start(environment.services.ethereum);
  await storage.start(environment.services.storage);
  await compiler.run(environment.compile);
  await tester.run();
  process.exit();
}

const command = process.argv[2];
if (command === 'web') {
  testWeb();
} else if (command === 'contract') {
  const environment = lifecycle.before();
  testAsync(environment);
  lifecycle.after(environment);
}
