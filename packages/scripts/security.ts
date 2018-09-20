#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as security from '@solon/security';
import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

security.run(environment.compile);
