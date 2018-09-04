import * as fs from 'fs';
import * as path from 'path';
import { Environment, Services } from '@solon/environment';
import { Signale } from 'signale';

function guardUniqBlockchainNode(services: Services, signale: Signale): void {
  const servicesEnabled: number = [!!services.ganache, !!services.infura, !!services.geth]
    .filter((enable: boolean) => enable)
    .length;
  
  if (servicesEnabled > 1) {
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

  guardUniqBlockchainNode(environment.services, signale);
  guardContractsFileExists(environment.deploy.contracts, environment.structure.contracts.src, signale)
  signale.success('Environment OK');
}