import { build } from '@solon/environment';
import { Signale } from 'signale';

import { Solc } from './strategies/solc';

const signale = new Signale({ scope: 'Compiler' });

export const run = (): Promise<boolean> => {
  const compile = build().compile
  const solcContracts = compile.contracts.filter(contractName => contractName.endsWith('.sol'));
  return new Solc(solcContracts, compile, signale).compile();
};
