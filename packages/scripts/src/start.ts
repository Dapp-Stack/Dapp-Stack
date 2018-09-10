#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as path from 'path';
import * as fs from 'fs-extra';
import { buildEnvironment } from '@solon/environment';

import { compileAll } from './shared/compile';
import { deploy } from './shared/deploy';
import { watch } from './shared/watch';
import { startWeb } from './shared/web';
import { generateWalletAsync } from './shared/wallet';
import * as services from './shared/services';
import { validateEnvironment } from './shared/environment';

if (!process.env.SOLON_ENV) {
  process.env.SOLON_ENV = 'local';
}

const solonEnv = process.env.SOLON_ENV;
const environmentFile = require(path.resolve(process.cwd(), 'environments', solonEnv)) || {};
const environment = buildEnvironment(environmentFile);

fs.ensureDirSync(path.join(process.cwd(), '.solon', solonEnv));
fs.ensureDirSync(path.join(process.cwd(), 'logs', solonEnv));

async function startAsync() {
  await validateEnvironment(environment);
  await services.startGethAsync(environment);
  await services.startIpfsAsync(environment);
  await services.startIpfsAsync(environment);
  await generateWalletAsync(environment);
  compileAll(environment);
  deploy(environment);
  watch(environment);
  startWeb();
}

async function stopAsync({ exit }: { exit: boolean } = { exit: false }) {
  await services.stopGethAsync();
  await services.stopIpfsAsync();

  if (exit) {
    process.exit();
  }
}

startAsync();

process.stdin.resume();

process.on('SIGINT', stopAsync.bind(null, { exit: true }));
process.on('SIGUSR1', stopAsync.bind(null, { exit: true }));
process.on('SIGUSR2', stopAsync.bind(null));
process.on('uncaughtException', (error) => {
  console.log(error.stack);
  stopAsync.bind(null, { exit: true })();
});
