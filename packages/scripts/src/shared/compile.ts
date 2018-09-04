import { compile } from '@solon/compiler';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function compileAll(environment: Environment): void {
  const compiler = new Signale({interactive: true, scope: 'Compiler'});

  environment.deploy.contracts.forEach((contractName: string) => {
    compiler.await(`Starting to compile: ${contractName}`)
    compile(contractName, environment).then(() =>(
      compiler.success(`Successfully compile: ${contractName}`)
    )).catch(() => (
      compiler.error(`Error while compiling: ${contractName}`)
    ));
  });
}