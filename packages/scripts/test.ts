#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { testWeb } from './shared/web';

testWeb();