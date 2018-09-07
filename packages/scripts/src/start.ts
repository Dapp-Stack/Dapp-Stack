#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as path from 'path';
import * as fs from 'fs-extra';
import { buildEnvironment } from '@solon/environment';

import { compileAll } from './shared/compile';
import { deployAll } from './shared/deploy';
import { watch } from './shared/watch';
import { startWeb } from './shared/web';
import { startGethAsync, stopGethAsync, startIpfs } from './shared/services';
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
  await startGethAsync(environment);
  // startIpfs(environment);
  // await compileAll(environment);
  // deployAll(environment);
  // watch(environment);
  // await startWeb();
}

async function stopAsync({ exit }: { exit: boolean } = { exit: false }) {
  await stopGethAsync();
  // startIpfs(environment);
  // await compileAll(environment);
  // deployAll(environment);
  // watch(environment);
  // await startWeb();
  
  if (exit) {
    process.exit();
  }
}

startAsync();

process.stdin.resume();

process.on('SIGINT', stopAsync.bind(null, {exit: true}));
process.on('SIGUSR1', stopAsync.bind(null, {exit: true}));
process.on('SIGUSR2', stopAsync.bind(null));
process.on('uncaughtException', stopAsync.bind(null));