import * as ethers from 'ethers';

export interface BuildContractsInput {
  [name: string]: {
    address: string;
    abi: string;
  };
}
