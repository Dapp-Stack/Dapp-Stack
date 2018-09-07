import { compile } from '@solon/compiler';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function compileAll(environment: Environment): void {
  const compiler = new Signale({scope: 'Compiler'});

  environment.deploy.contracts.forEach(async (contractName: string) => {
    compiler.await(`Starting to compile: ${contractName}`)
    compile(contractName, environment).then(() =>(
      compiler.success(`Successfully compiled: ${contractName}`)
    )).catch((error) => (
      compiler.error(`Error while compiling: ${contractName}: ${error}`)
    ));
  });
}