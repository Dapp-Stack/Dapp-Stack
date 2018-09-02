import * as Docker from 'dockerode';
import { Environment } from '@solon/environment';

let docker = new Docker();
const mapping = {
  sol: 'solc',
};

const dockerSolc = function(contractName: string) {
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
};

export function compile(contractName: string, compileOption): void {
  console.log(`[Contracts] Starting to compile ${contractName}`);

  return dockerSolc(contractName, compileOption)
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
    compile(contractName, environment.services.compile);
  });
}
