import * as ethereum from '@solon/ethereum';
import * as ipfs from '@solon/ipfs';
import * as web from '@solon/web';
import * as test from '@solon/test';

export async function stopAsync({ shouldExit }: { shouldExit: boolean } = { shouldExit: false }) {
  await ethereum.stop();
  await ipfs.stop();
  tester.cleanCoverage();
  web.stop();

  if (shouldExit) {
    process.exit();
  }
}

export function after() {
  process.stdin.resume();

  process.on('SIGTERM', stopAsync.bind(null, { shouldExit: true }));
  process.on('SIGINT', stopAsync.bind(null, { shouldExit: true }));
  process.on('SIGUSR1', stopAsync.bind(null, { shouldExit: true }));
  process.on('SIGUSR2', stopAsync.bind(null));
  process.on('uncaughtException', error => {
    console.log(error.stack);
    stopAsync.bind(null, { shouldExit: true })();
  });
}
