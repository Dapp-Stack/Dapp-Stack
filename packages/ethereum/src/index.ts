import { build } from '@solon/environment';
import { Signale } from 'signale';

import { Ganache } from './strategies/ganache';
import { Geth } from './strategies/geth';
import { Infura } from './strategies/infura';
import { Null } from './strategies/null';
import { IEthereumStrategy } from './types';

const signale = new Signale({ scope: 'Ethereum' });

const strategy = (): IEthereumStrategy => {
  const ethereum = build().services.ethereum;
  if (!ethereum) return new Null();

  switch (ethereum.network) {
    case 'dev':
      return new Geth(ethereum, signale);
    case 'ganache':
      return new Ganache(ethereum, signale);
    default:
      return new Infura(ethereum, signale);
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