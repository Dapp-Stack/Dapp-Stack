export type Maybe<T> = false | T;

export type Wallet = {
  mnemonic: string;
  numAccount: number;
};

export type InfuraNetwork = 'homestead' | 'rinkeby' | 'ropsten' | 'kovan'
export type GethType = 'dev' | 'ropsten' | 'mainnet';

export type EthereumProvider = 'ganache' | 'geth' | 'infura';

export type Ethereum = {
  provider: EthereumProvider;
  infura: {
    network: InfuraNetwork;
  };
  ganache: {
    mnemonic: string;
  };
  geth: {
    type: GethType;
  };
};

export interface Services {
  ethereum: Maybe<Ethereum>;
  ipfs: boolean;
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
  solc: 'js' | 'binary';
}

export interface Deploy {
  wallet?: Wallet;
  migrate: (deployer: any) => void;
}

export interface Environment {
  services: Services;
  compile: Compile;
  deploy: Deploy;
}
