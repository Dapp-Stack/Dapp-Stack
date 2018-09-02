import * as fs from 'fs';
import { connect } from '@solon/web3-wrapper';
import { Environment } from '@solon/environment';

export default class Deployer {
  constructor(environment: Environment) {
    this.web3 = connect();
    this.environment = environment;
  }

  getGasPrice(callback?: Function) {
    return this.web3.eth.getGasPrice(callback);
  }

  getAccounts(callback?: Function) {
    return this.web3.eth.getAccounts(callback);
  }

  async deploy(contractName: string, options = {}) {
    let gasPrice = await getGasPrice();
    let from = options.from || (await getAccounts())[0];
    let args = { arguments: options.args || [] };
    let source = fs.readFileSync(`${__dirname}/../build/${contractName}/combined.json`);
    let contracts = JSON.parse(source)['contracts'];
    let keys = Object.keys(contracts);
    let contractInfo = contracts[keys[0]];

    let abi = JSON.parse(contractInfo.abi);
    let data = '0x' + contractInfo.bin;

    let contractClass = new this.web3.eth.Contract(abi, null, { data });
    let gas = await contractClass.deploy(args).estimateGas();

    return contractClass
      .deploy(args)
      .send({
        gas,
        gasPrice,
        from,
      })
      .on('error', function(error) {
        console.log(`[Contracts] error while deploying ${contractName}: ${error}`);
      })
      .on('receipt', function() {
        console.log(`[Contracts] Finished to deploy ${contractName}`);
      });
  }
}
