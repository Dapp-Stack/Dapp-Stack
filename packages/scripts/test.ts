#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as tester from '@solon/test';
import * as compiler from '@solon/compiler';
import { testWeb } from './shared/web';

async function testAsync() {
  await compiler.run();
  await tester.run();
  process.exit();
}

const command = process.argv[2];
if (command === 'web') {
  testWeb();
} else if (command === 'contract') {
  testAsync();
}
