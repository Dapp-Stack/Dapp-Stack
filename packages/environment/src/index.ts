import { merge } from 'lodash';
import * as path from 'path';
import { Signale } from 'signale';
import * as Ajv from 'ajv';

import { Environment, WebFramework, Maybe } from './types';

const signale = new Signale({ scope: 'Environment' });

export const Structure = {
  contracts: {
    src: path.join(process.cwd(), 'contracts', 'src'),
    build: path.join(process.cwd(), 'contracts', 'build'),
    doc: path.join(process.cwd(), 'contracts', 'doc'),
    security: path.join(process.cwd(), 'contracts', 'security'),
    test: path.join(process.cwd(), 'contracts', 'tests'),
    coverage: path.join(process.cwd(), 'contracts', 'coverage'),
  },
  secrets: path.join(process.cwd(), 'secrets.json.enc'),
  masterKey: path.join(process.cwd(), 'master.key'),
  assets: path.join(process.cwd(), 'build'),
  tracker: (framework: Maybe<WebFramework>): string => {
    switch (framework) {
      case 'vue':
      case 'react':
        return path.join(process.cwd(), 'public', 'tracker.json');
      case 'angular':
        return path.join(process.cwd(), 'src', 'assets', 'tracker.json');
      default:
        return path.join(process.cwd(), 'tracker.json');
    }
  },
};

const schema = {
  title: 'Environment Schema',
  type: 'object',
  properties: {
    ethereum: {
      type: 'object',
      properties: {
        network: {
          type: 'string',
          enum: ['homestead', 'rinkeby', 'ropsten', 'kovan', 'dev', 'external'],
        },
        apiKey: {
          type: 'string',
        },
        mnemonic: {
          type: 'string',
        },
        migrate: {},
      },
      required: ['network', 'migrate'],
    },
    ipfs: {
      type: 'boolean',
    },
    web: {
      type: 'object',
      properties: {
        framework: {
          type: 'string',
          enum: ['react', 'angular', 'vue', 'test'],
        },
        deploy: {
          type: 'string',
          enum: ['ipfs'],
        },
      },
      required: ['framework', 'deploy'],
    },
    compile: {
      type: 'object',
      properties: {
        contracts: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
          ],
        },
        solc: {
          type: 'string',
          enum: ['js', 'binary'],
        },
      },
      required: ['contracts', 'solc'],
    },
  },
  required: ['ipfs', 'web', 'compile'],
};

const ajv = new Ajv();
const environmentSchema = ajv.compile(schema);

const defaultEnvironment: Environment = {
  ethereum: {
    network: 'dev',
    migrate() {},
  },
  ipfs: false,
  web: {
    framework: 'react',
    deploy: 'ipfs',
  },
  compile: {
    solc: 'js',
    contracts: [],
  },
};

export const build = (): Environment => {
  const solonEnv = process.env.SOLON_ENV || 'local';
  let environmentFile;
  try {
    environmentFile = require(path.resolve(process.cwd(), 'environments', solonEnv)) || {};
  } catch (_error) {
    signale.error(
      `Cannot load the environment file, make sure the following file exists: ${path.resolve(
        process.cwd(),
        'environments',
        solonEnv,
      )}`,
    );
    process.exit(1);
  }
  const environment = merge({}, defaultEnvironment, environmentFile);
  if (!environmentSchema(environment)) {
    signale.error('The environment file does not follow the specification.');
    signale.error(ajv.errorsText(environmentSchema.errors));
    process.exit(1);
  }
  return environment;
};

export * from './types';
