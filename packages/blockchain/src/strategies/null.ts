import { IBlockchainStrategy } from '../types';

export class Null implements IBlockchainStrategy {
  start = () => {
    return new Promise<boolean>(resolve => resolve(true));
  };

  stop = () => {
    return new Promise<boolean>(resolve => resolve(true));
  };
}
