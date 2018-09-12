import { buildEnvironment, Environment } from '@solon/environment';
import * as fs from 'fs-extra';
import * as path from 'path';

import * as blockchain from './blockchain';
import * as storage from './storage';

export function before(): Environment {
  if (!process.env.SOLON_ENV) {
    process.env.SOLON_ENV = 'local';
  }

  const solonEnv = process.env.SOLON_ENV;
  const environmentFile = require(path.resolve(process.cwd(), 'environments', solonEnv)) || {};
  const environment = buildEnvironment(environmentFile);

  fs.ensureDirSync(path.join(process.cwd(), '.solon', solonEnv));
  fs.ensureDirSync(path.join(process.cwd(), 'logs', solonEnv));

  return environment;
}

export async function stopAsync(environment: Environment, { shouldExit }: { shouldExit: boolean } = { shouldExit: false }) {
  await blockchain.stop(environment);
  await storage.stopIpfsAsync(environment);

  if (shouldExit) {
    process.exit();
  }
}

export function after(environment: Environment) {
  process.stdin.resume();

  process.on('SIGINT', stopAsync.bind(null, environment, { shouldExit: true }));
  process.on('SIGUSR1', stopAsync.bind(null, environment, { shouldExit: true }));
  process.on('SIGUSR2', stopAsync.bind(null));
  process.on('uncaughtException', error => {
    console.log(error.stack);
    stopAsync.bind(null, environment, { shouldExit: true })();
  });
}
