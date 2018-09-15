import { Compile, Structure } from '@solon/environment';
import { Signale } from 'signale';
import { ICompileStrategy } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { forIn } 'lodash';
import solc from 'solc';

type Input = {
  [contractName: string]: {
    content: string;
  }
}

const INPUT_SETTINGS = {
  outputSelection: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    "*": {
      "*": ['abi', 'ast', 'devdoc', 'userdoc', 'metadata', 'evm.gasEstimates', 'evm.assembly', 'evm.bytecode.object', 'evm.bytecode.sourceMap']
    }
  }
};

export class Solc implements ICompileStrategy {
  private contracts: string[];
  private config: Compile;
  private signale: Signale;

  constructor(contracts: string[], config: Compile, signale: Signale) {
    this.contracts= contracts;
    this.config = config;
    this.signale = signale;
  }

  input = (): Input => {
    return this.contracts.reduce((acc: Input, contractName) => (
      acc[contractName] = { content: fs.readFileSync(path.join(Structure.contract.src, contractName), 'utf-8') }
    ) , {})
  }

  compile = () => {
    this.signale.await(`Starting to compile the contracts`);
    return new Promise<boolean>((resolve, reject) => {
      const output = solc.compileStandardWrapper({ sources: this.input(), settings: INPUT_SETTINGS });
      if (output.errors && output.errors.find(error => error.severity === 'error')) {
        this.signale.error(`Compilation failed`);
        reject(output.errors);
      }

      forIn(output.contract, (contractName, compilationResult) => {
        fs.writeFileSync(path.join(Structure.contract.src, contractName, 'bytecode'), compilationResult.bytecode, 'utf-8');
        fs.writeFileSync(path.join(Structure.contract.src, contractName, 'inteface'), compilationResult.interface, 'utf-8');
      });
      this.signale.success(`Contracts compiled`);
      resolve(true)
    });
  }
}