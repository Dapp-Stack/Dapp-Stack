import { Deploy, Structure } from '@solon/environment';
import { generateWallet } from '@solon/wallet';
import * as fs from 'fs';
import * as path from 'path';
import { Signale } from 'signale';
import Web3 = require('web3');
import { glob } from 'glob';

export const run = (config: Deploy, web3?: Web3) => {
  new Deployer(config, web3).run();
}

export class Deployer {
  private config: Deploy;
  private signale: Signale;
  private contractFiles!: { [basename: string]: string };
  public contracts!: string[];
  public web3?: Web3;
  public accounts!: string[];
  public gasPrice!: number;

  constructor(config: Deploy, web3?: Web3) {
    this.config = config;
    this.web3 = web3
    this.signale = new Signale({ scope: 'Deployer' });
    this.initializeWeb3()
    this.initializeContracts
  }

  private initializeContracts = () => {
    glob(`${Structure.contracts.build}/**/*.json`, {}, (_, files: string[]) => {
      this.contractFiles = files.reduce((acc: { [basename: string]: string }, file) => {
        acc[path.basename(file, '.json')] = file;
        return acc;
      }, {});
      this.contracts = Object.keys(this.contractFiles);
    });
  }

  private initializeWeb3 = () => {
    if (this.web3) {
      this.setupExtra(this.web3);
    } else {
      generateWallet(this.config).then((web3: Web3) => {
        this.web3 = web3
        this.setupExtra(web3);
      })
    }
  }

  private setupExtra = async (web3: Web3) => {
    this.accounts = await web3.eth.getAccounts();
    this.gasPrice = await web3.eth.getGasPrice();
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

  async deploy(contract: string, options: { from?: string; args?: any[] } = {}) {
    if (!this.contractFiles || !this.web3) {
      return;
    }

    const from = options.from || this.accounts[0];
    const args = { data: '', arguments: options.args || [] };
    const gasPrice = this.gasPrice;
    const contractFile = this.contractFiles[contract];

    if (!contractFile) {
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
