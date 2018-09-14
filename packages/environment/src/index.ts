import * as path from 'path';
import { merge } from 'lodash';
import { Environment } from './types';

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

export function build(): Environment {
  const solonEnv = process.env.SOLON_ENV || 'local';
  const environmentFile = require(path.resolve(process.cwd(), 'environments', solonEnv)) || {};
  const environment =  merge({}, defaultEnvironment, environmentFile);

  return environment;
}

export * from './types';