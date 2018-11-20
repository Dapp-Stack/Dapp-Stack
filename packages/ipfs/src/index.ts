import { build } from '@dapp-stack/environment';
import { Signale } from 'signale';

import { Go } from './strategies/go';
import { Null } from './strategies/null';
import { IIpfsStrategy } from './types';

const signale = new Signale({ scope: 'Ipfs' });

const strategy = (): IIpfsStrategy => {
  const enabled = build().ipfs;
  if (!enabled) return new Null();

  return new Go(signale);
};

export const start = (): Promise<boolean> => {
  return strategy().start();
};

export const stop = (): Promise<boolean> => {
  return strategy().stop();
};
