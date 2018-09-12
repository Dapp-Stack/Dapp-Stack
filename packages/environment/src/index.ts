import { merge } from 'lodash';
import { Deployer } from '@solon/deployer';
import * as http from 'http';
export type GethType = 'dev' | 'ropsten' | 'mainnet';

export type Wallet = {
  mnemonic: string;
  numAccount: number;
  wei?: number;
};

export type Geth =
  | false
  | {
      type: GethType;
    };

export type Ganache = boolean;

export type Infura =
  | false
  | {
      url: string;
    };

export type Solc =
  | false
  | {
      version: string;
    };

export interface Structure {
  contracts: {
    src: string;
    build: string;
  };
  src: string;
  public: string;
}

export interface Services {
  geth: Geth;
  ipfs: boolean;
  ganache: Ganache;
  infura: Infura;
  compile: {
    solc: Solc;
  };
}

export interface Deploy {
  contracts: string[];
  migrate: (deployer: Deployer) => void;
}

export interface Environment {
  structure: Structure;
  services: Services;
  wallet?: Wallet;
  web: boolean;
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
    geth: false,
    ganache: false,
    infura: false,
    ipfs: true,
    compile: {
      solc: {
        version: 'latest',
      },
    },
  },
  web: true,
  deploy: {
    contracts: [],
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

    const httpOk = await pingAsync('http://localhost:8545');
    resolve(!httpOk);
  });
}

export function gethOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.ganache) {
      return resolve(true);
    }

    const httpOk = await pingAsync('http://localhost:8545');
    resolve(!httpOk);
  });
}

export function infuraOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.infura) {
      return resolve(true);
    }

    const httpOk = await pingAsync(environment.services.infura.url);
    resolve(httpOk);
  });
}

export function ipfsOk(environment: Environment): Promise<boolean> {
  return new Promise<boolean>(async resolve => {
    if (!environment.services.ipfs) {
      return resolve(true);
    }

    const httpOk = await pingAsync('http://localhost:5001');
    resolve(!httpOk);
  });
}

export function servicesEnabledLength(environment: Environment): number {
  const { ganache, infura, geth } = environment.services;
  return [!!ganache, !!infura, !!geth].filter((enable: boolean) => enable).length;
}

export function buildEnvironment(environment: object): Environment {
  return merge({}, defaultEnvironment, environment);
}
