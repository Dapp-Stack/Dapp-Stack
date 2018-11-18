#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as wallet from '@solon/wallet';

import { globalError } from './shared/globalError';

try {
  wallet.exportPrivateKey();
} catch (error) {
  globalError(error);
}
