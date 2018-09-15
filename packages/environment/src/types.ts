import { Deployer } from '@solon/deployer';

export type Maybe<T> = false | T;

export type Wallet = {
  mnemonic: string;
  numAccount: number;
};

export type GethType = 'dev' | 'ropsten' | 'mainnet';

export type BlockchainProvider = 'ganache' | 'geth' | 'infura';

export type Blockchain = {
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

export type Storage = 'ipfs'

export interface Services {
  blockchain: Maybe<Blockchain>;
  storage: Maybe<Storage>;
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
  services: Services;
  compile: Compile;
  deploy: Deploy;
}