import { Compile } from '@solon/environment';
import { Signale } from 'signale';

import { ICompileStrategy } from './types'
import { Solc } from './strategies/solc';

const signale = new Signale({ scope: 'Compiler' });

const strategy = (contractName: string, compile: Compile): ICompileStrategy => {  
  if (contractName.endsWith('.sol')) {
    return new Solc(contractName, compile, signale);
  }
}

export const runAll = (compile: Compile): Promise<boolean>[] => {
  return compile.contracts.map(async (contractName: string) => run(contractName, compile));
}

export const run = (contractName: string, compile: Compile): Promise<boolean> => {
  return strategy(contractName, compile).compile();
}