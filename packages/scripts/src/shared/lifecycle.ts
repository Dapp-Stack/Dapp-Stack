import * as path from 'path';
import * as fs from 'fs-extra';
import { Environment, buildEnvironment } from "@solon/environment";
import * as services from "./services";

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

async function stopAsync({ exit }: { exit: boolean } = { exit: false }) {
  await services.stopGethAsync();
  await services.stopIpfsAsync();

  if (exit) {
    process.exit();
  }
}

export function after() {
  process.stdin.resume();

  process.on('SIGINT', stopAsync.bind(null, { exit: true }));
  process.on('SIGUSR1', stopAsync.bind(null, { exit: true }));
  process.on('SIGUSR2', stopAsync.bind(null));
  process.on('uncaughtException', (error) => {
    console.log(error.stack);
    stopAsync.bind(null, { exit: true })();
  }); 
}