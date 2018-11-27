import * as ethers from 'ethers'

import { EthererumDeployer } from './deployer'

const ERC20 = require('../../../abi/ERC20.json')

export class Erc20 {
  private readonly deployer: EthererumDeployer

  constructor(deployer: EthererumDeployer) {
    this.deployer = deployer
  }

  async bootstrap() {
    await this.deploy('ERC20', ERC20)
  }

  private readonly deploy = async (
    contractName: string,
    contract: { interface: string; bytecode: string },
    ...args: any[]
  ) => {
    const factory = new ethers.ContractFactory(
      contract.interface,
      contract.bytecode,
      this.deployer.signer
    )
    const deployedContract = await this.deployer.deployContractFactory(
      contractName,
      factory,
      ...args
    )
    return deployedContract
  }
}
