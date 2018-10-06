import { Ethereum } from '@solon/environment';
import { IEthereumStrategy } from '../types';
import { Signale } from 'signale';

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
