import { build } from '@solon/environment';
import { Signale } from 'signale';

import { IEthereumStrategy } from './types';
import { Geth } from './strategies/geth';
import { Infura } from './strategies/infura';
import { Ganache } from './strategies/ganache';
import { Null } from './strategies/null';

const signale = new Signale({ scope: 'Ethereum' });

const strategy = (): IEthereumStrategy => {
  const ethereum = build().services.ethereum;
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

export const console = () => {
  const ethereum = build().services.ethereum;
  if (!ethereum) {
    return signale.error('This command is only available when using the ethereum');
  }

  new Geth(ethereum, signale).console();
};

export const start = (): Promise<boolean> => {
  return strategy().start();
};

export const stop = (): Promise<boolean> => {
  return strategy().stop();
};
