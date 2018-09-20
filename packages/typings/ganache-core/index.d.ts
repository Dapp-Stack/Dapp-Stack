import { Http2Server } from 'http2';
import { Provider } from 'web3/providers';
declare module 'ganache-core';

export type GanacheOpts = {
  accounts?: {
    balance: string;
    secretKey: string;
  }[]
  verbose?: boolean;
  logger?: {
    log(message: string): void;
  };
  port?: number;
  network_id?: number;
  networkId?: number;
  mnemonic?: string;
  gasLimit?: number;
};

export function server(opts?: GanacheOpts): Http2Server;
export function provider(opts: GanacheOpts): Provider;
