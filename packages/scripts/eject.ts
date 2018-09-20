#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { ejectWeb } from './shared/web';

ejectWeb();
