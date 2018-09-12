import { Environment } from '@solon/environment';
import * as Docker from 'dockerode';
import * as path from 'path';

const docker = new Docker();
interface CompilerMapping {
  [key: string]: (contractName: string, environment: Environment) => Promise<any>;
}
const compilersMapping: CompilerMapping = {
  sol(contractName: string, environment: Environment) {
    const { src, build } = environment.structure.contracts;
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
    const options = {
      Binds: [`${path.join(process.cwd(), src)}:/solidity/src`, `${path.join(process.cwd(), build)}:/solidity/build`],
    };
    return docker.run('ethereum/solc:0.4.24', command, process.stdout, options).then(container => container.remove());
  },
  notFound() {
    return new Promise(resolve => resolve());
  },
};

export function compile(contractName: string, environment: Environment): Promise<void> {
  const type: string = Object.keys(compilersMapping).find((t: string) => contractName.endsWith(t)) || 'notFound';

  return compilersMapping[type](contractName, environment);
}
