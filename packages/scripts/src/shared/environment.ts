import * as fs from 'fs';
import * as path from 'path';
import { 
  Environment, 
  servicesEnabledLength, 
  gethOk, 
  infuraOk, 
  ipfsOk, 
  ganacheOk 
} from '@solon/environment';
import { Signale } from 'signale';

function guardUniqBlockchainNode(environment: Environment, signale: Signale): void {
  if (servicesEnabledLength(environment) > 1) {
    signale.error("Environment error: too many blockchain node enabled")
    process.exit(1)
  }
}

function guardContractsFileExists(contracts: string[], contractSrc: string, signale: Signale): void {
  contracts.forEach((contract: string) => {
    if (!fs.existsSync(path.join(process.cwd(), contractSrc, contract))){
      signale.error(`Environment error: contract do not exist ${contract}`)
      process.exit(1);
    }
  })
}

async function guardServicesPingAsync(environment: Environment, signale: Signale) {
  const geth = await gethOk(environment)
  if (!geth) {
    signale.error('Environment error: geth address is already taken')
    process.exit(1);
  }
  const infura = await infuraOk(environment)
  if (!infura) {
    signale.error('Environment error: infura url is not reachable')
    process.exit(1);
  }
  const ipfs = await ipfsOk(environment)
  if (!ipfs) {
    signale.error('Environment error: ipfs address is already taken')
    process.exit(1);
  }
  const ganache = await ganacheOk(environment)
  if (!ganache) {
    signale.error('Environment error: ganache address is already taken')
    process.exit(1);
  }
}

export function validateEnvironment(environment: Environment): void {
  const signale = new Signale({interactive: true, scope: 'Environment'});
  signale.await('Validating environment...');

  guardUniqBlockchainNode(environment, signale);
  guardContractsFileExists(environment.deploy.contracts, environment.structure.contracts.src, signale);
  guardServicesPingAsync(environment, signale);
  signale.success('Environment OK');
}