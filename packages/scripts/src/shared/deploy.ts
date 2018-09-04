import { deploy } from '@solon/deployer';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function deployAll(environment: Environment): void {
  const compiler = new Signale({interactive: true, scope: 'Deployer'});

  environment.deploy.contracts.forEach((contractName: string) => {
    compiler.await(`Starting to compile: ${contractName}`)
    deploy(contractName, environment).then(() =>(
      compiler.success(`Successfully compile: ${contractName}`)
    )).catch(() => (
      compiler.error(`Error while compiling: ${contractName}`)
    ));
  });
}