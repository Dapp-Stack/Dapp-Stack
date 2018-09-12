import { Environment } from '@solon/environment';
import { connect } from '@solon/web3-wrapper';
import * as fs from 'fs';
import * as path from 'path';
import web3 = require('web3');

export class Deployer {

  public contracts: string[];
  public environment: Environment;
  private web3!: Web3;
  private accounts!: string[];
  private gasPrice!: number;

  constructor(environment: Environment) {
    this.environment = environment;
    this.contracts = environment.deploy.contracts;
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

  async deploy(contractName: string, options: { from?: string; args?: any[] } = {}) {
    const from = options.from || this.accounts[0];
    const args = { data: '', arguments: options.args || [] };
    const gasPrice = this.gasPrice;

    const source = fs.readFileSync(
      path.join(process.cwd(), this.environment.structure.contracts.build, contractName, 'combined.json'),
    );

    const contracts = JSON.parse(source.toString('utf8'))['contracts'];
    const keys = Object.keys(contracts);
    const contractInfo = contracts[keys[0]];

    const abi = JSON.parse(contractInfo.abi);
    const data = `0x${contractInfo.bin}`;

    const contractClass = new this.web3.eth.Contract(abi, undefined, { data });
    const gas = await contractClass.deploy(args).estimateGas();

    return contractClass.deploy(args).send({
      gas,
      gasPrice,
      from,
    });
  }
}
