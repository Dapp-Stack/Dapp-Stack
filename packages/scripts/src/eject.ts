#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import { eject } from './shared/web';

eject();