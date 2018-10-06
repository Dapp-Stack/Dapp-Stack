import { build } from '@solon/environment';
import * as ethers from 'ethers';

export const connect = () => {
  const ethereum = build().services.ethereum;
  if (!ethereum) return new ethers.providers.JsonRpcProvider();

  switch (ethereum.provider) {
    case 'geth':
      return new ethers.providers.JsonRpcProvider();
    case 'infura':
      return new ethers.providers.InfuraProvider(ethereum.infura.network);
    case 'ganache':
      return new ethers.providers.JsonRpcProvider();
  }
};
