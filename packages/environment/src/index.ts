import { Deployer } from '@solon/deployer';
import * as http from 'http';
import { merge } from 'lodash';

export type Wallet = {
  mnemonic: string;
  numAccount: number;
};

export type GethType = 'dev' | 'ropsten' | 'mainnet';
export type BlockchainProvider = 'ganache' | 'geth' | 'infura';

export interface Blockchain {
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

export interface Services {
  blockchain: false | Blockchain;
  storage: false | 'ipfs';
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

const defaultEnvironment: Environment = {
  structure: {
    contracts: {
      src: 'contracts/src',
      build: 'contracts/build',
    },
    src: 'src',
    public: 'public',
  },
  services: {
    blockchain: {
      provider: 'ganache'
    },
    storage: false,
    web: true,
  },
  compile: {
    solc: 'js',
    contracts: []
  },
  deploy: {
    migrate() {},
  },
};

async function pingAsync(url: string): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    http
      .get(url, res => {
        const { statusCode } = res;
        return resolve(statusCode === 200);
      })
      .on('error', () => {
        return resolve(false);
      });
  });
}

export function ganacheOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.geth) {
      return resolve(true);
    }

    const isHttpOk = await pingAsync('http://localhost:8545');
    resolve(!isHttpOk);
  });
}

export function gethOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.ganache) {
      return resolve(true);
    }

    const isHttpOk = await pingAsync('http://localhost:8545');
    resolve(!isHttpOk);
  });
}

export function infuraOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.infura) {
      return resolve(true);
    }

    const isHttpOk = await pingAsync(environment.services.infura.url);
    resolve(isHttpOk);
  });
}

export function ipfsOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.ipfs) {
      return resolve(true);
    }

    const isHttpOk = await pingAsync('http://localhost:5001');
    resolve(!isHttpOk);
  });
}

export function servicesEnabledLength(environment: Environment): number {
  const { ganache, infura, geth } = environment.services;
  return [!!ganache, !!infura, !!geth].filter((enable: boolean) => enable).length;
}

export function buildEnvironment(environment: object): Environment {
  return merge({}, defaultEnvironment, environment);
}
