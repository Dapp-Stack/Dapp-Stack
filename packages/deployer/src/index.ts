import { Deploy, Structure } from '@solon/environment';
import { generateWallet } from '@solon/wallet';
import * as fs from 'fs';
import * as path from 'path';
import { Signale } from 'signale';
import Web3 = require('web3');
import { glob } from 'glob';

export class Deployer {
  private config: Deploy;
  private signale: Signale;
  private contractFiles?: { [basename: string]: string };
  private contracts?: string[];
  private web3!: Web3;
  private accounts!: string[];
  private gasPrice!: number;

  constructor(config: Deploy) {
    this.config = config;
    this.signale = new Signale({ scope: 'Deployer' });

    glob(`${Structure.contracts.build}/**/*.json`, {}, (_, files: string[]) => {
      this.contractFiles = files.reduce((acc: { [basename: string]: string }, file) => {
        acc[path.basename(file, '.json')] = file
        return acc
      }, {})
      this.contracts = Object.keys(this.contractFiles);
    })
  }

  async run() {
    try {
      this.signale.await('Starting to deploy contracts by running migrage...');
      this.web3 = await generateWallet(this.config);
      this.accounts = await this.web3.eth.getAccounts();
      this.gasPrice = await this.web3.eth.getGasPrice();
      await this.config.migrate(this);
      this.signale.success('Contracts have been deployed');
    } catch (error) {
      this.signale.error(error);
    }
  }

  async deploy(contract: string, options: { from?: string; args?: any[] } = {}) {
    if (!this.contractFiles) {
      return;
    }

    const from = options.from || this.accounts[0];
    const args = { data: '', arguments: options.args || [] };
    const gasPrice = this.gasPrice;
    const contractFile = this.contractFiles[contract];

    if(!contractFile) {
      return;
    }

    const source = JSON.parse(fs.readFileSync(contractFile).toString());

    const abi = source.abi;
    const data = `0x${source.evm.bytecode.object}`;

    const contractClass = new this.web3.eth.Contract(abi, undefined, { data });
    const gas = await contractClass.deploy(args).estimateGas();

    return contractClass.deploy(args).send({
      gas,
      gasPrice,
      from,
    });
  }
}