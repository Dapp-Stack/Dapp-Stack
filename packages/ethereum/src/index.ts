import { Etherereum, Maybe } from '@solon/environment';
import { Signale } from 'signale';

import { IEtherereumStrategy } from './types';
import { Geth } from './strategies/geth';
import { Infura } from './strategies/infura';
import { Ganache } from './strategies/ganache';
import { Null } from './strategies/null';

const signale = new Signale({ scope: 'Etherereum' });

const strategy = (ethereum: Maybe<Etherereum>): IEtherereumStrategy => {
  if (!ethereum) return new Null();

  switch (ethereum.provider) {
    case 'geth':
      return new Geth(ethereum, signale);
    case 'infura':
      return new Infura(ethereum, signale);
    case 'ganache':
      return new Ganache(ethereum, signale);
  }
};

export const console = (ethereum: Maybe<Etherereum>) => {
  if (!ethereum) {
    return signale.error('This command is only available when using the ethereum');
  }

  new Geth(ethereum, signale).console();
};

export const start = (ethereum: Maybe<Etherereum>): Promise<boolean> => {
  return strategy(ethereum).start();
};

export const stop = (ethereum: Maybe<Etherereum>): Promise<boolean> => {
  return strategy(ethereum).stop();
};
