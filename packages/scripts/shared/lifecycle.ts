import { Environment, build } from '@solon/environment';

import * as blockchain from '@solon/blockchain';
import * as storage from '@solon/storage';

export function before(): Environment {
  return build();
}

export async function stopAsync(environment: Environment, { shouldExit }: { shouldExit: boolean } = { shouldExit: false }) {
  await blockchain.stop(environment.services.blockchain);
  await storage.stop(environment.services.storage);

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
