import { Http2Server } from 'http2';

declare module 'ganache-core';

export type GanacheOpts = {
  verbose?: boolean;
  logger?: {
    log(message: string): void;
  };
  port?: number;
  network_id?: number;
  networkId?: number;
  mnemonic?: string;
  gasLimit?: number;
}

export function server(opts?: GanacheOpts): Http2Server;