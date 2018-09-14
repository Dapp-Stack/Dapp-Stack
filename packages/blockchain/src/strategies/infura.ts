import { Blockchain } from '@solon/environment';
import { IBlockchainStrategy } from '../types';
import { Signale } from 'signale';

export class Infura implements IBlockchainStrategy {
  private config: Blockchain;
  private signale: Signale;

  constructor(config: Blockchain, signale: Signale) {
    this.config = config;
    this.signale = signale;
  }

  start = () => {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  }
}
