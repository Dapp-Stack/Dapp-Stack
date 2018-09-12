import * as _ from 'lodash';
import Web3 = require('web3');
import { Provider } from 'web3/providers';

const defaultHttp: string = 'http://localhost:8545';
const defaultWs: string = 'ws://localhost:8546';

class NotConnectedError extends Error {
  constructor() {
    super('Could not connect to a node.');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const connect = (provider?: string | Provider): Promise<Web3> => {
  return new Promise<Web3>(async (resolve, reject) => {
    const web3 = await _.compact([provider, defaultWs, defaultHttp]).reduce(reducer, Promise.resolve(undefined));
    if (web3) {
      return resolve(web3);
    }

    reject(new NotConnectedError());
  });
};

const reducer = (web3Promised: Promise<Web3 | undefined>, provider: string | Provider): Promise<Web3 | undefined> => {
  return new Promise<Web3 | undefined>(async (resolve, reject) => {
    const web3 = await web3Promised;
    if (web3) {
      return resolve(web3);
    }
    const instance = new Web3(provider);
    let connected;
    try {
      connected = await instance.eth.net.isListening();
    } catch {
      return resolve();
    }
    if (connected) {
      return resolve(instance);
    }

    return resolve();
  });
};
