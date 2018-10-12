#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as web from '@solon/web';

web.eject();
