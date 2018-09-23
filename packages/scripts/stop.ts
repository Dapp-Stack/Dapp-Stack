#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

lifecycle.stopAsync(environment, { shouldExit: true });
