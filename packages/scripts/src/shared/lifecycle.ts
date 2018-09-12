import * as path from 'path';
import * as fs from 'fs-extra';
import { Environment, buildEnvironment } from "@solon/environment";
import * as blockchain from "./blockchain";
import * as storage from "./storage";

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

export async function stopAsync(environment: Environment, { exit }: { exit: boolean } = { exit: false }) {
  await blockchain.stop(environment);
  await storage.stopIpfsAsync(environment);

  if (exit) {
    process.exit();
  }
}

export function after(environment: Environment) {
  process.stdin.resume();

  process.on('SIGINT', stopAsync.bind(null, environment, { exit: true }));
  process.on('SIGUSR1', stopAsync.bind(null, environment, { exit: true }));
  process.on('SIGUSR2', stopAsync.bind(null));
  process.on('uncaughtException', (error) => {
    console.log(error.stack);
    stopAsync.bind(null, environment, { exit: true })();
  }); 
}