#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as compiler from '@solon/compiler';
import * as tester from '@solon/test';
import * as web from '@solon/web';

import * as lifecycle from './shared/lifecycle';

const shouldRunCoverage = process.env.COVERAGE;

async function testAsync() {
  if (shouldRunCoverage) {
    await compiler.run();
    tester.setupCoverage();
  }
  await compiler.run();
  await tester.run();
  if (shouldRunCoverage) {
    tester.finishCoverage();
  }
  await lifecycle.stopAsync({ shouldExit: true });
}

const command = process.argv[2];
if (command === 'web') {
  web.test();
} else if (command === 'contract') {
  testAsync();
  lifecycle.after();
}