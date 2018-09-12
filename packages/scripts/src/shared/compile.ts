import * as compiler from '@solon/compiler';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function compileAll(environment: Environment): void {
  const signale = new Signale({ scope: 'Compiler' });
  signale.await('Starting to compile contracts');
  environment.deploy.contracts.map(async (contractName: string) => {
    await compile(contractName, environment);
  });
}

export function compile(contractName: string, environment: Environment): Promise<void> | undefined {
  const signale = new Signale({ scope: 'Compiler' });
  try {
    const promise = compiler.compile(contractName, environment);
    signale.success(`Successfully compiled: ${contractName}`);
    return promise;
  } catch (error) {
    signale.error(`Error while compiling: ${contractName}: ${error}`);
  }

  return undefined;
}
