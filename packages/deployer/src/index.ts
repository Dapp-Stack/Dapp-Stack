import { Environment, Structure } from '@solon/environment';
import { connect } from '@solon/web3-wrapper';
import * as fs from 'fs';
import * as path from 'path';
import Web3 = require('web3');

export class Deployer {

  public contracts: string[];
  public environment: Environment;
  private web3!: Web3;
  private accounts!: string[];
  private gasPrice!: number;

  constructor(environment: Environment) {
    this.environment = environment;
    this.contracts = environment.compile.contracts;
  }

  async run() {
    try {
      this.web3 = await connect();
      this.accounts = await this.web3.eth.getAccounts();
      this.gasPrice = await this.web3.eth.getGasPrice();
      this.environment.deploy.migrate(this);
    } catch (e) {
      console.log(e.message);
    }
  }

  async deploy(contractName: string, options: { from?: string; args?: any[] } = {}) {
    const from = options.from || this.accounts[0];
    const args = { data: '', arguments: options.args || [] };
    const gasPrice = this.gasPrice;

    const source = JSON.parse(fs.readFileSync(
      path.join(Structure.contracts.build, contractName, 'SimpleStorage.json'),
    ).toString());

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