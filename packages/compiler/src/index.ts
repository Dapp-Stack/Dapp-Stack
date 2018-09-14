import { Environment } from '@solon/environment';
import * as Docker from 'dockerode';
import * as path from 'path';

const docker = new Docker();
const IMAGE_NAME = 'ethereum/solc:0.4.24';

interface CompilerMapping {
  [key: string]: (contractName: string, environment: Environment) => Promise<any>;
}
const compilersMapping: CompilerMapping = {
  async sol(contractName: string, environment: Environment) {
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
    await downloadImage();
    return docker.run(IMAGE_NAME, command, process.stdout, options).then(container => container.remove());
  },
  notFound() {
    return new Promise(resolve => resolve());
  },
};

export function compile(contractName: string, environment: Environment): Promise<void> {
  const type: string = Object.keys(compilersMapping).find((t: string) => contractName.endsWith(t)) || 'notFound';

  return compilersMapping[type](contractName, environment);
}

function downloadImage(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    docker.pull(IMAGE_NAME, {}, (err, stream) => {
      if (err) {
        return reject(err);
      }
      docker.modem.followProgress(stream, onFinished);

      function onFinished() {
        return resolve(true);
      }
    });
  });
}

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

import { Environment } from '@solon/environment';
import { generateWallet } from '@solon/wallet';
import { Signale } from 'signale';

export async function generateWalletAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Wallet' });
  signale.await('Generating Wallet...');
  try {
    await generateWallet(environment);
    signale.success('Wallet generated');
  } catch (error) {
    signale.error(error);
  }
}
