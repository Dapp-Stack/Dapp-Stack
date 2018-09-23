import { Blockchain, Maybe } from '@solon/environment';
import { Signale } from 'signale';

import { IBlockchainStrategy } from './types';
import { Geth } from './strategies/geth';
import { Infura } from './strategies/infura';
import { Ganache } from './strategies/ganache';
import { Null } from './strategies/null';

const signale = new Signale({ scope: 'Blockchain' });

const strategy = (blockchain: Maybe<Blockchain>): IBlockchainStrategy => {
  if (!blockchain) return new Null();

  switch (blockchain.provider) {
    case 'geth':
      return new Geth(blockchain, signale);
    case 'infura':
      return new Infura(blockchain, signale);
    case 'ganache':
      return new Ganache(blockchain, signale);
  }
};

export const console = (blockchain: Maybe<Blockchain>) => {
  if (!blockchain) {
    return signale.error('This command is only available when using the blockchain');
  }

  new Geth(blockchain, signale).console();
};

export const start = (blockchain: Maybe<Blockchain>): Promise<boolean> => {
  return strategy(blockchain).start();
};

export const stop = (blockchain: Maybe<Blockchain>): Promise<boolean> => {
  return strategy(blockchain).stop();
};
