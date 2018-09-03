import { merge } from 'lodash';

export type GethType = 'dev';
export type Geth = false | {
  type: GethType;
}
export type Solc = false | {
  version: string;
}

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
  compile: {
    solc: Solc;
  };
}

export interface Deploy {
  contracts: string[];
  migrate: () => void;
}

export interface Environment {
  structure: Structure;
  services: Services;
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
    geth: {
      type: 'dev',
    },
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

export function buildEnvironment(environment: object): Environment {
  return merge({}, defaultEnvironment, environment);
}
