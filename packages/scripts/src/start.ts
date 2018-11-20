#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as compiler from '@dapp-stack/compiler';
import * as deployer from '@dapp-stack/deployer';
import * as doc from '@dapp-stack/doc';
import * as ethereum from '@dapp-stack/ethereum';
import * as ipfs from '@dapp-stack/ipfs';
import * as web from '@dapp-stack/web';
import * as api from '@dapp-stack/api';

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
