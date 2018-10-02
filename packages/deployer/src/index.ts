import { Deploy, Structure } from '@solon/environment';
import { generateWallet } from '@solon/wallet';
import * as fs from 'fs-extra';
import { glob } from 'glob';
import * as path from 'path';
import { Signale } from 'signale';
import Web3 = require('web3');

import { update } from './tracker';

export const run = async (config: Deploy, web3?: Web3) => {
  const deployer = new Deployer(config, web3);
  await deployer.initialize();
  await deployer.run();
};

export class Deployer {
  public contracts!: string[];
  public web3?: Web3;
  public accounts!: string[];
  public gasPrice!: number;
  private config: Deploy;
  private signale: Signale;
  private contractFiles!: { [basename: string]: string };

  constructor(config: Deploy, web3?: Web3) {
    this.config = config;
    this.web3 = web3;
    this.signale = new Signale({ scope: 'Deployer' });
  }

  initialize = async () => {
    await fs.ensureFile(Structure.contracts.tracker);
    await this.initializeContracts();
    await this.initializeWeb3();
  }

  async run() {
    try {
      this.signale.await('Starting to deploy contracts by running migrate...');
      await this.config.migrate(this);
      this.signale.success('Contracts have been deployed');
    } catch (error) {
      this.signale.error(error);
    }
  }

  async deploy(contractName: string, options: { from?: string; args?: any[] } = {}) {
    if (!this.contractFiles || !this.web3) {
      return;
    }

    const from = options.from || this.accounts[0];
    const args = { data: '', arguments: options.args || [] };
    const contractFile = this.contractFiles[contractName];
    if (!contractFile) {
      return;
    }

    const source = JSON.parse(fs.readFileSync(contractFile).toString());

    const abi = source.abi;
    const data = `0x${source.evm.bytecode.object}`;

    const contract = new this.web3.eth.Contract(abi, undefined, { data });
    const gas = await contract.deploy(args).estimateGas();

    return contract.deploy(args).send({
      gas,
      from,
      gasPrice: this.gasPrice,
    }).then((deployedContract) => {
      update(contractName, deployedContract.options.address);
      return deployedContract;
    });
  }

  private initializeContracts = () => {
    return new Promise<void>(resolve => {
      glob(`${Structure.contracts.build}/**/*.json`, {}, (_, files: string[]) => {
        this.contractFiles = files.reduce((acc: { [basename: string]: string }, file) => {
          acc[path.basename(file, '.json')] = file;
          return acc;
        }, {});
        this.contracts = Object.keys(this.contractFiles);
        resolve();
      });
    });
  }

  private initializeWeb3 = async () => {
    if (this.web3) {
      await this.setupExtra(this.web3);
    } else {
      this.web3 = await generateWallet(this.config);
      await this.setupExtra(this.web3);
    }
  }

  private setupExtra = async (web3: Web3) => {
    this.accounts = await web3.eth.getAccounts();
    this.gasPrice = await web3.eth.getGasPrice();
  }
}
