import { Environment } from '@solon/environment';
import * as Ganache from 'ganache-core';

export function start(environment: Environment): Promise<void> {
  const server = Ganache.server();
  return new Promise<void>(resolve => {
    server.listen(8545, (error: Error) => {
      resolve();
    });
  });
}
