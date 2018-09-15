import { Compile } from '@solon/environment';
import { Signale } from 'signale';

import { ICompileStrategy } from './types'
import { Solc } from './strategies/solc';

const signale = new Signale({ scope: 'Compiler' });

export const run = (compile: Compile): Promise<boolean> => {
  const solcContracts = compile.contracts.filter(contractName => contractName.endsWith('.sol'));
  return new Solc(solcContracts, compile, signale);
}