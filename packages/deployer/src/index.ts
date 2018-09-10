import * as fs from 'fs';
import * as path from 'path';
import { connect } from '@solon/web3-wrapper';
import { Environment } from '@solon/environment';
import Web3 = require('web3');

export class Deployer {
  private web3!: Web3;
  private accounts!: string[];
  private gasPrice!: number;

  private environment: Environment;

  constructor(environment: Environment) {
    this.environment = environment;
  }

  async runAsync() {
    try {
      this.web3 = await connect();
      this.accounts = await this.web3.eth.getAccounts();
      this.gasPrice = await this.web3.eth.getGasPrice();
      this.environment.deploy.migrate(this);
    } catch (e) {
      console.log(e.message);
    }
  }

  contracts() {
    return this.environment.deploy.contracts;
  }

  async deploy(contractName: string, options: { from?: string; args?: any[] } = {}) {
    let from = options.from || this.accounts[0];
    console.log(from);
    let args = { data: '', arguments: options.args || [] };
    let gasPrice = this.gasPrice;

    let source = fs.readFileSync(
      path.join(process.cwd(), this.environment.structure.contracts.build, contractName, 'combined.json'),
    );

    let contracts = JSON.parse(source.toString('utf8'))['contracts'];
    let keys = Object.keys(contracts);
    let contractInfo = contracts[keys[0]];

    let abi = JSON.parse(contractInfo.abi);
    let data = '0x' + contractInfo.bin;

    let contractClass = new this.web3.eth.Contract(abi, undefined, { data });
    let gas = await contractClass.deploy(args).estimateGas();

    return contractClass.deploy(args).send({
      gas,
      gasPrice,
      from,
    });
  }
}
