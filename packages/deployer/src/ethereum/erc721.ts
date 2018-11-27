import * as ethers from 'ethers'

import { EthererumDeployer } from './deployer'

const ERC721 = require('../../../abi/ERC721.json')

export class Erc721 {
  private readonly deployer: EthererumDeployer

  constructor(deployer: EthererumDeployer) {
    this.deployer = deployer
  }

  async bootstrap() {
    await this.deploy('ERC721', ERC721)
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
