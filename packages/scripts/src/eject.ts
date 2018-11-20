#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as web from '@dapp-stack/web';

import { globalError } from './shared/globalError';

try {
  web.eject();
} catch (error) {
  globalError(error);
}
