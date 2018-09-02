import * as Docker from 'dockerode';
import { Environment } from '@solon/environment';

let docker = new Docker();
interface CompilerMapping {
  [key: string]: (contractName: string, environment: Environment) => Promise<any>;
}
const compilersMapping: CompilerMapping = {
  sol: function(contractName: string) {
    const command = [
      '-o',
      `/solidity/build/${contractName}`,
      '--allow-paths',
      '/solidity/src',
      '--optimize',
      '--combined-json',
      'abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc',
      '--overwrite',
      `/solidity/src/${contractName}`,
    ];
    const options = { Binds: [`${__dirname}/../src:/solidity/src`, `${__dirname}/../build:/solidity/build`] };
    return docker.run('ethereum/solc:0.4.24', command, process.stdout, options).then(function(container) {
      return container.remove();
    });
  },
  notFound: function() {
    return new Promise();
  }
};

export function compile(contractName: string, environment: Environment): Promise<void> {
  console.log(`[Contracts] Starting to compile ${contractName}`);

  const type: string = Object.keys(compilersMapping).find((t: string) => contractName.endsWith(t)) || 'notFound';

  return compilersMapping[type](contractName, environment)
    .then(function() {
      console.log(`[Contracts] Finished to compile ${contractName}`);
    })
    .catch(function(err) {
      console.log(`[Contracts] Error while compiling ${contractName}`);
      console.log(err);
    });
}

export function compileAll(environment: Environment): void {
  environment.deploy.contracts.forEach((contractName: string) => {
    compile(contractName, environment);
  });
}
