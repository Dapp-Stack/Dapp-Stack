import * as fs from 'fs';
import * as path from 'path';
import { Environment, Services, servicesEnabledLength } from '@solon/environment';
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

export function validateEnvironment(environment: Environment): void {
  const signale = new Signale({interactive: true, scope: 'Environment'});
  signale.await('Validating environment...');

  guardUniqBlockchainNode(environment, signale);
  guardContractsFileExists(environment.deploy.contracts, environment.structure.contracts.src, signale)
  signale.success('Environment OK');
}