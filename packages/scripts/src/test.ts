#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as compiler from '@solon/compiler';
import * as tester from '@solon/test';
import * as web from '@solon/web';

async function testAsync() {
  await compiler.run();
  await tester.run();
  process.exit();
}

const command = process.argv[2];
if (command === 'web') {
  web.test();
} else if (command === 'contract') {
  testAsync();
}
