import { Ethereum } from '@solon/environment';
import { Signale } from 'signale';

import { IEthereumStrategy } from '../types';

export class Infura implements IEthereumStrategy {
  private config: Ethereum;
  private signale: Signale;

  constructor(config: Ethereum, signale: Signale) {
    this.config = config;
    this.signale = signale;
  }

  start = () => {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  };

  stop = () => {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  };
}
