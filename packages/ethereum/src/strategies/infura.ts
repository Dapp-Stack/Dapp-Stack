import { Etherereum } from '@solon/environment';
import { IEtherereumStrategy } from '../types';
import { Signale } from 'signale';

export class Infura implements IEtherereumStrategy {
  private config: Etherereum;
  private signale: Signale;

  constructor(config: Etherereum, signale: Signale) {
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
