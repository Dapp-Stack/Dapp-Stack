import { Storage } from '@solon/environment';
import { Signale } from 'signale';
import { IStorageStrategy } from '../types';


export class Ipfs implements IStorageStrategy {
  private config: Storage;
  private signale: Signale;

  constructor(config: Storage, signale: Signale) {
    this.config = config;
    this.signale = signale;
  }

  start = () => {
    this.signale.await('Starting ipfs...')
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
