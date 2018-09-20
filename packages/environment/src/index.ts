import * as path from 'path';
import { merge } from 'lodash';
import { Environment } from './types';

export const Structure = {
  contracts: {
    src: path.join(process.cwd(), 'contracts', 'src'),
    build: path.join(process.cwd(), 'contracts', 'build'),
    doc: path.join(process.cwd(), 'contracts', 'doc'),
    security: path.join(process.cwd(), 'contracts', 'security'),
    test: path.join(process.cwd(), 'contracts', 'tests'),
  },
  src: path.join(process.cwd(), 'src'),
  public: path.join(process.cwd(), 'public'),
};

const defaultEnvironment: Environment = {
  services: {
    blockchain: {
      provider: 'ganache',
      infura: {
        url: ""
      },
      ganache: {
        mnemonic: ""
      },
      geth: {
        type: "dev"
      }
    },
    storage: false,
    web: true,
  },
  compile: {
    solc: 'js',
    contracts: [],
  },
  deploy: {
    migrate() {},
  },
};

export function build(): Environment {
  const solonEnv = process.env.SOLON_ENV || 'local';
  const environmentFile = require(path.resolve(process.cwd(), 'environments', solonEnv)) || {};
  const environment = merge({}, defaultEnvironment, environmentFile);

  return environment;
}

export * from './types';
