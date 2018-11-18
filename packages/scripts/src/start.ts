#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';
import * as doc from '@solon/doc';
import * as ethereum from '@solon/ethereum';
import * as ipfs from '@solon/ipfs';
import * as web from '@solon/web';
import * as api from '@solon/api';

import * as lifecycle from './shared/lifecycle';
import { watch } from './shared/watch';
import { globalError } from './shared/globalError';

async function startAsync() {
  try {
    await ethereum.start();
    await ipfs.start();
    await compiler.run();
    doc.runAll();
    await deployer.run();
    watch();
    web.start();
    api.start();
  } catch (error) {
    globalError(error);
  }
}

startAsync();

lifecycle.after();
