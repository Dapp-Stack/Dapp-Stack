import { merge } from 'lodash';

export type GethType = 'dev';

export interface Structure {
  contracts: {
    src: string;
    build: string;
  };
  src: string;
  public: string;
}

export interface Services {
  geth: {
    type: GethType;
  };
  ipfs: boolean;
  compile: {
    solc: {
      version: string;
    };
  };
}

export interface Deploy {
  contracts: string[];
  migrate: () => void;
}

export interface Environment {
  structure: Structure;
  services: Services;
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
  deploy: {
    contracts: [],
    migrate() {},
  },
};

export function buildEnvironment(environment: any): Environment {
  return merge({}, defaultEnvironment, environment);
}
