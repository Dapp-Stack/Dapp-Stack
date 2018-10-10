export type Maybe<T> = false | T;

export type EthereumNetwork = 'homestead' | 'rinkeby' | 'ropsten' | 'kovan' | 'dev' | 'ganache';

export type Ethereum = {
  network: EthereumNetwork;
  apiKey?: string;
  mnemonic?: string;
  migrate: (deployer: any) => void;
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

export interface Environment {
  services: Services;
  compile: Compile;
}
