import { Deployer } from '@solon/deployer';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function deploy(environment: Environment): void {
  const signale = new Signale({ scope: 'Deployer' });

  signale.await('Starting to deploy...');
  try {
    const deployer = new Deployer(environment);
    deployer.runAsync();
    signale.success('Deployment finished with success');
  } catch (error) {
    signale.error(`Error while deploying: ${error.message}`);
  }
}
