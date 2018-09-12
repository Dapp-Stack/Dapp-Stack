import { Http2Server } from 'http2';

declare module 'ganache-core';

export interface GanacheOpts {
  verbose?: boolean;
  logger?: {
    log(msg: string): void;
  };
  port?: number;
  network_id?: number;
  networkId?: number;
  mnemonic?: string;
  gasLimit?: number;
}
export function server(opts?: GanacheOpts): Http2Server;
