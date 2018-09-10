import * as compiler from '@solon/compiler';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function compileAll(environment: Environment): void {
  environment.deploy.contracts.forEach(async (contractName: string) => {
    compile(contractName, environment);
  });
}

export function compile(contractName: string, environment: Environment): void {
  const signale = new Signale({ scope: 'Compiler' });

  compiler
    .compile(contractName, environment)
    .then(() => signale.success(`Successfully compiled: ${contractName}`))
    .catch(error => signale.error(`Error while compiling: ${contractName}: ${error}`));
}
