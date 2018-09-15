#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as fs from 'fs-extra';
import * as path from 'path';
import { Signale } from 'signale';
import { Structure } from '@solon/environment';

import * as lifecycle from './shared/lifecycle';

const environment = lifecycle.before();

const solonDir = path.join(process.cwd(), '.solon');
const webDir = path.join(process.cwd(), '.build');
const contractDir = path.join(process.cwd(), Structure.contracts.build);

const signale = new Signale({ scope: 'Cleaner' });
signale.await('cleaner started');

if (fs.existsSync(solonDir)) {
  fs.removeSync(solonDir);
  signale.success('.solon directory removed');
}

if (fs.existsSync(webDir)) {
  fs.removeSync(webDir);
  signale.success('build directory removed');
}

if (fs.existsSync(contractDir)) {
  fs.removeSync(contractDir);
  signale.success(`${Structure.contracts.build} directory removed`);
}
