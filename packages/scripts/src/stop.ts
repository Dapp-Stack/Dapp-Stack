#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as lifecycle from './shared/lifecycle';

lifecycle.stopAsync({ shouldExit: true });
