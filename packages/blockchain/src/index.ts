import { Blockchain } from '@solon/environment';
import { Signale } from 'signale';

import { IBlockchainStrategy } from './types';
import { Geth } from './strategies/geth';
import { Infura } from './strategies/infura';
import { Ganache } from './strategies/ganache';


const signale = new Signale({ scope: 'Blockchain' });

const strategy = (blockchain: Blockchain): IBlockchainStrategy => {
  switch(blockchain.provider) {
    case 'geth':
      return new Geth(blockchain, signale);
    case 'infura':
      return new Infura(blockchain, signale);
    case 'ganache':
      return new Ganache(blockchain, signale);
  }
}

const available = (blockchain: Blockchain): boolean => !!blockchain;

export const console = (blockchain: Blockchain) => {
  if(!available) return;
}

export const start = (blockchain: Blockchain): Promise<boolean> | undefined => {
  if(!available) return;
  return strategy(blockchain).start();
}

export const stop = (blockchain: Blockchain): Promise<boolean> | undefined=> {
  if(!available) return;
  return strategy(blockchain).stop();
}