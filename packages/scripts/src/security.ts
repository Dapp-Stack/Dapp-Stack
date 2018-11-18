#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as security from '@solon/security';

import { globalError } from './shared/globalError';

try {
  security.run();
} catch (error) {
  globalError(error);
}
