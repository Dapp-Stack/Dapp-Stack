import { Environment } from '@solon/environment';
import * as Ganache from 'ganache-core';

export function start(environment: Environment): Promise<void> {
  const server = Ganache.server();
  return server.listen(); 
}