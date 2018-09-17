#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

async function stopAsync() {
  lifecycle.stopAsync(environment);
}

stopAsync();
