import { Environment, build } from '@solon/environment';

import * as ethereum from '@solon/ethereum';
import * as storage from '@solon/storage';
import { stopWeb } from './web';

export function before(): Environment {
  return build();
}

export async function stopAsync(
  environment: Environment,
  { shouldExit }: { shouldExit: boolean } = { shouldExit: false },
) {
  await ethereum.stop(environment.services.ethereum);
  await storage.stop(environment.services.storage);
  stopWeb();

  if (shouldExit) {
    process.exit();
  }
}

export function after(environment: Environment) {
  process.stdin.resume();

  process.on('SIGTERM', stopAsync.bind(null, environment, { shouldExit: true }));
  process.on('SIGINT', stopAsync.bind(null, environment, { shouldExit: true }));
  process.on('SIGUSR1', stopAsync.bind(null, environment, { shouldExit: true }));
  process.on('SIGUSR2', stopAsync.bind(null));
  process.on('uncaughtException', error => {
    console.log(error.stack);
    stopAsync.bind(null, environment, { shouldExit: true })();
  });
}
