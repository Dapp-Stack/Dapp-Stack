import { Compile, Structure } from '@solon/environment';
import { Signale } from 'signale';
import { ICompileStrategy } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { forEach } from 'lodash';
import solc from 'solc';

type Input = {
  [contractName: string]: {
    content: string;
  }
}

type CompilationOutput = {
  errors?: [
    {
      severity: string;
    }
  ],
  contracts: {
    [contractName: string]: {
      bytecode: string;
      interface: string;
    }
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
      acc[contractName] = { content: fs.readFileSync(path.join(Structure.contracts.src, contractName), 'utf-8') }
    ) , {})
  }

  compile = () => {
    this.signale.await(`Starting to compile the contracts`);
    return new Promise<boolean>((resolve, reject) => {
      const output: CompilationOutput = solc.compileStandardWrapper({ sources: this.input(), settings: INPUT_SETTINGS });
      if (output.errors && output.errors.find(error => error.severity === 'error')) {
        this.signale.error(`Compilation failed`);
        reject(output.errors);
      }

      forEach(output.contracts, (compilationResult, contractName) => {
        fs.writeFileSync(path.join(Structure.contracts.src, contractName, 'bytecode'), compilationResult.bytecode, 'utf-8');
        fs.writeFileSync(path.join(Structure.contracts.src, contractName, 'inteface'), compilationResult.interface, 'utf-8');
      });
      this.signale.success(`Contracts compiled`);
      resolve(true)
    });
  }
}