import { merge } from 'lodash';

type GethType = 'dev'

interface Services {
  geth?: {
    type?: GethType
  },
  ipfs?: boolean,
  compile?: {
    solc?: {
      version?: string
    } 
  }
}

interface Deploy {
  contracts: string[],
  migrate: () => void;
}

export interface Environment {
  services?: Services,
  deploy: Deploy
}

const defaultEnvironment: Environment = {
  services: {
    geth: {
      type: 'dev',
    },
    ipfs: true,
    compile: {
      solc: {
        version: 'latest'
      }
    }
  },
  deploy: {
    contracts: [],
    migrate(){}
  }
}

export function buildEnvironment(environment: Environment): Environment {
  return merge({}, defaultEnvironment, environment);
}
