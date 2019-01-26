import { merge } from 'lodash'
import * as path from 'path'
import { Signale } from 'signale'
import * as Ajv from 'ajv'

import { Environment, WebFramework, Maybe } from './types'

const signale = new Signale({ scope: 'Environment' })

const ajv = new Ajv({ allErrors: true, jsonPointers: true })
require('ajv-errors')(ajv, { singleError: true })

export const Structure = {
  contracts: {
    realSrc: path.join(process.cwd(), 'contracts', 'src'),
    src: process.env.COVERAGE
      ? path.join(process.cwd(), 'contracts', 'coverage', 'src')
      : path.join(process.cwd(), 'contracts', 'src'),
    build: process.env.COVERAGE
      ? path.join(process.cwd(), 'contracts', 'coverage', 'build')
      : path.join(process.cwd(), 'contracts', 'build'),
    doc: path.join(process.cwd(), 'contracts', 'doc'),
    security: path.join(process.cwd(), 'contracts', 'security'),
    test: path.join(process.cwd(), 'contracts', 'tests'),
    coverage: path.join(process.cwd(), 'contracts', 'coverage')
  },
  secrets: path.join(process.cwd(), 'secrets.json.enc'),
  masterKey: path.join(process.cwd(), 'master.key'),
  assets: path.join(process.cwd(), 'build'),
  tracker: (framework: Maybe<WebFramework>): string => {
    switch (framework) {
      case 'vue':
      case 'create-react-app':
        return path.join(process.cwd(), 'public', 'tracker.json')
      case 'angular':
        return path.join(process.cwd(), 'src', 'assets', 'tracker.json')
      case 'next':
        return path.join(process.cwd(), 'static', 'tracker.json')
      case 'test':
        return path.join(Structure.contracts.coverage, 'tracker.json')
      default:
        return path.join(process.cwd(), 'tracker.json')
    }
  }
}

const schema = {
  title: 'Environment Schema',
  type: 'object',
  properties: {
    ethereum: {
      type: ['object', 'boolean'],
      properties: {
        network: {
          type: 'string',
          enum: ['homestead', 'rinkeby', 'ropsten', 'kovan', 'dev', 'external'],
          errorMessage:
            'should be equal to one of the allowed values: homestead, rinkeby, ropsten, kovan, dev or external'
        },
        apiKey: {
          type: 'string'
        },
        mnemonic: {
          type: 'string'
        },
        migrate: {}
      },
      required: ['network', 'migrate']
    },
    ipfs: {
      type: 'boolean'
    },
    web: {
      type: 'object',
      properties: {
        framework: {
          type: ['string', 'boolean'],
          enum: ['create-react-app', 'angular', 'vue', 'test', 'next', false],
          errorMessage:
            'should be equal to one of the allowed values: create-react-app, angular, vue, test, next or false'
        },
        deploy: {
          type: ['string', 'boolean'],
          enum: ['ipfs', false],
          errorMessage:
            'should be equal to one of the allowed values: ipfs or false'
        }
      },
      required: ['framework', 'deploy']
    },
    compile: {
      type: 'object',
      properties: {
        vyper: {
          type: 'array',
          items: [
            {
              type: 'string'
            }
          ]
        },
        optimizer: {
          type: 'object',
          properties: {
            enabled: {
              type: 'boolean'
            },
            runs: {
              type: 'number'
            }
          },
          required: ['enabled', 'runs']
        },
        solidity: {
          type: 'object'
        }
      },
      required: ['vyper', 'solidity', 'optimizer']
    }
  },
  required: ['ipfs', 'web', 'compile']
}

const environmentSchema = ajv.compile(schema)

const defaultEnvironment: Environment = {
  ethereum: {
    network: 'dev',
    migrate() {
      return new Promise<void>(resolve => resolve())
    }
  },
  ipfs: false,
  web: {
    framework: 'create-react-app',
    deploy: 'ipfs'
  },
  compile: {
    solidity: {},
    vyper: [],
    optimizer: {
      enabled: false,
      runs: 200
    }
  }
}

export const build = (): Environment => {
  const dappEnv = process.env.DAPP_ENV || 'local'
  let environmentFile
  try {
    environmentFile =
      require(path.resolve(process.cwd(), 'environments', dappEnv)) || {}
  } catch (error) {
    signale.error(
      `Cannot load the environment file, make sure the following file exists: ${path.resolve(
        process.cwd(),
        'environments',
        dappEnv
      )}`
    )
    signale.error(error)
    process.exit(1)
  }
  const environment = merge({}, defaultEnvironment, environmentFile)
  if (!environmentSchema(environment)) {
    signale.error('The environment file does not follow the specification.')
    signale.error(ajv.errorsText(environmentSchema.errors))
    process.exit(1)
  }

  return environment
}

export * from './types'
