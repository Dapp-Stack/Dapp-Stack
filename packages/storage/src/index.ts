import { Storage, Maybe } from '@solon/environment';
import { Signale } from 'signale';

import { IStorageStrategy } from './types';
import { Ipfs } from './strategies/ipfs';
import { Null } from './strategies/null';

const signale = new Signale({ scope: 'Storage' });

const strategy = (storage: Maybe<Storage>): IStorageStrategy => {
  if (!storage) return new Null();

  switch (storage) {
    case 'ipfs':
      return new Ipfs(storage, signale);
  }
};

export const start = (storage: Maybe<Storage>): Promise<boolean> => {
  return strategy(storage).start();
};

export const stop = (storage: Maybe<Storage>): Promise<boolean> => {
  return strategy(storage).stop();
};
