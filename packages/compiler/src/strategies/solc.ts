import { Compile, Structure } from '@solon/environment';
import { Signale } from 'signale';
import { ICompileStrategy } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { forEach } from 'lodash';
import * as solc from 'solc';

type CompilationOutput = {
  errors?: [
    {
      severity: string;
    }
  ],
  contracts: {
    [contractName: string]: {
      [contract: string]: {
        evm: {
          bytecode: string;
        }
        abi: string;
      }
    }
  }
}

export class Solc implements ICompileStrategy {
  private contracts: string[];
  private config: Compile;
  private signale: Signale;

  constructor(contracts: string[], config: Compile, signale: Signale) {
    this.contracts= contracts;
    this.config = config;
    this.signale = signale;
  }

  input = (): string => {
    const sources = this.contracts.reduce((acc: {[contractName: string]: {content: string}}, contractName) => {
      acc[contractName] = { content: fs.readFileSync(path.join(Structure.contracts.src, contractName), 'utf-8').toString() }
      return acc;
     } , {})

     return JSON.stringify({
       language: "Solidity",
       sources: sources,
       settings: {
        outputSelection: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          "*": {
            "*": ['abi', 'ast', 'devdoc', 'userdoc', 'metadata', 'evm.gasEstimates', 'evm.assembly', 'evm.bytecode.object', 'evm.bytecode.sourceMap']
          }
        }
      }
     });
  }

  compile = () => {
    this.signale.await(`Starting to compile the contracts`);
    return new Promise<boolean>((resolve, reject) => {
      const output: CompilationOutput = JSON.parse(solc.compileStandardWrapper(this.input()));

      if (output.errors) {
        this.signale.error(`Compilation failed`);
        return reject(`Compilation failed`);
      }

      forEach(output.contracts, (compilationResult, contractFile) => {
        fs.ensureDirSync(path.join(Structure.contracts.build, contractFile));
        forEach(compilationResult, (result, contract) => {
          fs.writeFileSync(path.join(Structure.contracts.build, contractFile, `${contract}.json`), JSON.stringify(result), 'utf-8');  
        });
      });
      this.signale.success(`Contracts compiled`);
      resolve(true)
    });
  }
}