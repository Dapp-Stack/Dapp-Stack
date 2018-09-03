#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as path from 'path';
import { buildEnvironment } from '@solon/environment';

import { compileAll } from '@solon/scripts/src/shared/compile';
import { watch } from 'fs';
import { startWeb } from '@solon/scripts/src/shared/web';

const solonEnv = process.env.SOLON_ENV || 'local';
const environmentFile = require(path.resolve(process.cwd(), 'environments', solonEnv)) || {};
const environment = buildEnvironment(environmentFile);

startGeth(environment);
startIpfs(environment);
compileAll(environment);
deployAll(environment);
watch(environment);
startWeb();