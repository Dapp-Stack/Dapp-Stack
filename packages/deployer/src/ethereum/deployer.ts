import { Ethereum, Structure, Web } from '@dapp-stack/environment'
import * as ethers from 'ethers'
import * as fs from 'fs-extra'
import * as globule from 'globule'
import * as path from 'path'
import { Signale } from 'signale'

import { Tracker } from './tracker'
import { EnsBuilder } from './ensBuilder'
import { Erc20 } from './erc20'
import { Erc721 } from './erc721'

export class EthererumDeployer {
  public contracts: string[]
  public signer: ethers.Signer
  public network!: ethers.utils.Network
  public gasPrice!: ethers.utils.BigNumber
  public tracker!: Tracker
  public ens: EnsBuilder
  public erc20: Erc20
  public erc721: Erc721
  private readonly config: Ethereum
  private readonly webConfig: Web
  private readonly signale: Signale
  private readonly contractFiles: { [basename: string]: string }

  constructor(config: Ethereum, webConfig: Web, signer: ethers.Signer) {
    this.config = config
    this.webConfig = webConfig
    this.signer = signer
    this.ens = new EnsBuilder(this)
    this.erc20 = new Erc20(this)
    this.erc721 = new Erc721(this)
    this.signale = new Signale({ scope: 'Deployer' })
    this.contractFiles = this.getContractFiles()
    this.contracts = Object.keys(this.contractFiles)
  }

  initialize = async () => {
    await this.initializeEthereum()
    this.tracker = new Tracker(this.network, this.webConfig)
  }

  async run() {
    try {
      this.signale.await(
        'Starting to deploy ethererum contracts by running migrate...'
      )
      this.tracker.reset()
      await this.config.migrate(this)
      this.signale.success('Ethererum contracts have been deployed')
    } catch (error) {
      this.signale.error(error)
    }
  }

  attach(contractName: string, address: string): ethers.Contract {
    const contractFile = this.contractFiles[contractName]
    if (!contractFile) {
      this.contractNotFound(contractName)
    }

    const source = JSON.parse(fs.readFileSync(contractFile).toString())
    this.tracker.update(contractName, address, JSON.stringify(source.abi))
    return new ethers.Contract(address, source.abi, this.signer)
  }

  async deploy(contractName: string, ...args: any[]): Promise<ethers.Contract> {
    const contractFile = this.contractFiles[contractName]
    if (!contractFile) {
      this.contractNotFound(contractName)
    }

    const source = JSON.parse(fs.readFileSync(contractFile).toString())

    const abi = source.abi
    const bytecode = `0x${source.evm.bytecode.object}`
    const factory = new ethers.ContractFactory(abi, bytecode, this.signer)
    return this.deployContractFactory(contractName, factory, ...args)
  }

  async deployContractFactory(
    contractName: string,
    factory: ethers.ContractFactory,
    ...args: any[]
  ) {
    this.signale.await(`Deploying ${contractName}...`)

    const contract = await factory.deploy(...args)
    await contract.deployed()

    this.tracker.update(
      contractName,
      contract.address,
      JSON.stringify(factory.interface.abi)
    )
    const receipt = await contract.deployTransaction.wait(1)
    this.printResult(contractName, contract, receipt)
    return contract
  }

  private readonly getContractFiles = () => {
    const files = globule.find(`${Structure.contracts.build}/**/*.json`)
    return files.reduce((acc: { [basename: string]: string }, file) => {
      acc[path.basename(file, '.json')] = file
      return acc
    }, {})
  }

  private readonly initializeEthereum = async () => {
    if (this.signer.provider) {
      this.gasPrice = await this.signer.provider.getGasPrice()
      this.network = await this.signer.provider.getNetwork()
    }
  }

  private readonly contractNotFound = (contractName: string) => {
    throw new Error(
      `Contract not found: ${contractName}, make sure this contract exists.`
    )
  }

  private readonly printResult = (
    contractName: string,
    contract: ethers.Contract,
    receipt: ethers.providers.TransactionReceipt
  ) => {
    this.signale.success('')
    this.signale.success(`Contract deployed: ${contractName}`)
    this.signale.success(`==================================`)
    this.signale.success(`Address: ${contract.address}`)
    this.signale.success(`Block number: ${receipt.blockNumber}`)
    this.signale.success(`Transaction hash: ${receipt.transactionHash}`)
    this.signale.success(`Gas used: ${receipt.gasUsed}`)
    this.signale.success('')
  }
}
