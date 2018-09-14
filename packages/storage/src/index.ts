import { Storage } from '@solon/environment';
import { Signale } from 'signale';

import { IStorageStrategy } from './types';
import { Ipfs } from './strategies/ipfs';

const signale = new Signale({ scope: 'Storage' });

const strategy = (storage: Storage): IStorageStrategy => {
  switch(storage) {
    case 'ipfs':
      return new Ipfs(storage, signale);
  }
}

const available = (storage: Storage): boolean => !!storage;

export const start = (storage: Storage): Promise<boolean> | undefined => {
  if(!available) return;
  return strategy(storage).start();
}

export const stop = (storage: Storage): Promise<boolean> | undefined=> {
  if(!available) return;
  return strategy(storage).stop();
}