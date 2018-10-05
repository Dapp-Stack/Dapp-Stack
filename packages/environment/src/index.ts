import { merge } from 'lodash';
import * as path from 'path';

import { Environment } from './types';

export const Structure = {
  contracts: {
    src: path.join(process.cwd(), 'contracts', 'src'),
    build: path.join(process.cwd(), 'contracts', 'build'),
    doc: path.join(process.cwd(), 'contracts', 'doc'),
    security: path.join(process.cwd(), 'contracts', 'security'),
    test: path.join(process.cwd(), 'contracts', 'tests'),
    tracker: path.join(process.cwd(), 'contracts', 'tracker.json'),
  },
  secrets: path.join(process.cwd(), 'secrets.json.enc'),
  masterKey: path.join(process.cwd(), 'master.key'),
  src: path.join(process.cwd(), 'src'),
  public: path.join(process.cwd(), 'public'),
};

const defaultEnvironment: Environment = {
  services: {
    ethereum: {
      provider: 'ganache',
      infura: {
        network: 'homestead',
      },
      ganache: {
        mnemonic: '',
      },
      geth: {
        type: 'dev',
      },
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
