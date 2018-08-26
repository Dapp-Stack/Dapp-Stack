import * as _ from 'lodash';
import Web3 from 'web3';
import { HttpProvider, IProvider, WebsocketProvider } from 'web3/types';

const defaultUrl: string = 'http://localhost:8545';

declare interface MetamaskInpageProvider extends IProvider {
  isMetaMask: Boolean;
  isConnected: () => Boolean;
  responseCallbacks: undefined;
  notificationCallbacks: undefined;
  connection: undefined;
  addDefaultEvents: undefined;
  on: undefined;
}

type Provider = MetamaskInpageProvider | WebsocketProvider | HttpProvider | string;

class BadProtocolError extends Error {
  constructor(protocol: string) {
    super(`the url provided has a protocol: ${protocol} that solon does not support.`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const connect = (provider: Provider = defaultUrl): Web3 | BadProtocolError => {
  const web3: Web3 = new Web3();

  if (typeof provider === 'string') {
    const url: URL = new URL(provider);
    let newProvider;
    switch (url.protocol) {
      case 'https':
      case 'http': {
        newProvider = new Web3.providers.HttpProvider(url.toString());
        break;
      }
      case 'ws': {
        newProvider = new Web3.providers.WebsocketProvider(url.toString());
        break;
      }
      default: {
        throw new Error(url.protocol);
      }
    }

    web3.setProvider(newProvider);
    return web3;
  }

  web3.setProvider(provider);
  return web3;
};
