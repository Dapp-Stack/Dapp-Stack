#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as web from '@solon/web';

import { globalError } from './shared/globalError';

try {
  web.eject();
} catch (error) {
  globalError(error);
}
