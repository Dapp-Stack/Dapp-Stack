import { Deployer } from '@solon/deployer';

export type Wallet = {
  mnemonic: string;
  numAccount: number;
};

export type GethType = 'dev' | 'ropsten' | 'mainnet';

export type BlockchainProvider = 'ganache' | 'geth' | 'infura';

export type Blockchain = false | {
  provider: BlockchainProvider;
  infura?: {
    url: string;
  };
  ganache?: {
    mnemonic: string;
  }
  geth?: {
    type: GethType;
  }
}

export type Storage = false | 'ipfs'

export interface Services {
  blockchain: Blockchain;
  storage: Storage;
  web: boolean;
}

export interface Structure {
  contracts: {
    src: string;
    build: string;
  };
  src: string;
  public: string;
}

export interface Compile {
  contracts: string[];
  solc: 'js' | 'binary'
}

export interface Deploy {
  walelt?: Wallet;
  migrate: (deployer: Deployer) => void;
}

export interface Environment {
  structure: Structure;
  services: Services;
  compile: Compile;
  deploy: Deploy;
}