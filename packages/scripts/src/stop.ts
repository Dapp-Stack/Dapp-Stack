#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as lifecycle from './shared/lifecycle';
import { globalError } from './shared/globalError';

try {
  lifecycle.stopAsync({ shouldExit: true });
} catch (error) {
  globalError(error);
}
