import { build } from '@solon/environment';
import * as ethers from 'ethers';

export const connect = (): ethers.providers.JsonRpcProvider => {
  const ethereum = build().services.ethereum;
  if (!ethereum) return new ethers.providers.JsonRpcProvider();

  switch (ethereum.network) {
    case 'dev':
    case 'ganache':
      return new ethers.providers.JsonRpcProvider();
    default:
      return new ethers.providers.InfuraProvider(ethereum.network);
  }
};
