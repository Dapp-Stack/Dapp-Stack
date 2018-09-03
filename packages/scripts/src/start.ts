#!/usr/bin/env node

process.on('unhandledRejection', err => {
  throw err;
});

import * as path from 'path';
import * as spawn from 'cross-spawn';

const solonEnv = process.env.SOLON_ENV || 'local';

const environment = require(path.resolve(process.cwd(), 'environments', solonEnv));
console.log(JSON.stringify(environment))
const reactScriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'start.js');
spawn('node', [reactScriptsPath], { stdio: 'ignore' });