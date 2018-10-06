#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as security from '@solon/security';

security.run();
