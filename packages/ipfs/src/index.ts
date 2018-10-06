import { Ipfs, Maybe } from '@solon/environment';
import { Signale } from 'signale';

import { IIpfsStrategy } from './types';
import { Ipfs } from './strategies/ipfs';
import { Null } from './strategies/null';

const signale = new Signale({ scope: 'Ipfs' });

const strategy = (ipfs: Maybe<Ipfs>): IIpfsStrategy => {
  if (!ipfs) return new Null();

  switch (ipfs) {
    case 'ipfs':
      return new Ipfs(ipfs, signale);
  }
};

export const start = (ipfs: Maybe<Ipfs>): Promise<boolean> => {
  return strategy(ipfs).start();
};

export const stop = (ipfs: Maybe<Ipfs>): Promise<boolean> => {
  return strategy(ipfs).stop();
};
