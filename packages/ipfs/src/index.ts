import { build } from '@solon/environment';
import { Signale } from 'signale';

import { IIpfsStrategy } from './types';
import { Go } from './strategies/go';
import { Null } from './strategies/null';

const signale = new Signale({ scope: 'Ipfs' });

const strategy = (): IIpfsStrategy => {
  const enabled = build().services.ipfs
  if (!enabled) return new Null();

  return new Go(signale);
};

export const start = (): Promise<boolean> => {
  return strategy().start();
};

export const stop = (): Promise<boolean> => {
  return strategy().stop();
};
