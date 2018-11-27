import * as ethers from 'ethers'

import { EthererumDeployer } from './deployer'

const ENSRegistry = require('../../../abi/ENSRegistry.json')
const PublicResolver = require('../../../abi/PublicResolver.json')
const FIFSRegistrar = require('../../../abi/FIFSRegistrar.json')
const ReverseRegistrar = require('../../../abi/ReverseRegistrar.json')

const utils = ethers.utils
const { namehash } = utils

export class EnsBuilder {
  private readonly deployer: EthererumDeployer
  private readonly registrars: { [domain: string]: ethers.Contract }
  private ens!: ethers.Contract
  private resolver!: ethers.Contract
  private adminRegistrar!: ethers.Contract

  constructor(deployer: EthererumDeployer) {
    this.deployer = deployer
    this.registrars = {}
  }

  async bootstrap() {
    this.ens = await this.deploy('ENSRegistry', ENSRegistry)
    this.adminRegistrar = await this.deploy(
      'FIFSRegistrar',
      FIFSRegistrar,
      this.ens.address,
      ethers.constants.HashZero
    )
    this.resolver = await this.deploy(
      'PublicResolver',
      PublicResolver,
      this.ens.address
    )
    await this.ens.setOwner(
      ethers.constants.HashZero,
      this.adminRegistrar.address
    )
  }

  async registerTLD(tld: string) {
    const tldHash = utils.keccak256(utils.toUtf8Bytes(tld))
    const ethNode = namehash(tld)
    const address = await this.deployer.signer.getAddress()
    await this.adminRegistrar.register(tldHash, address)
    await this.ens.setResolver(ethNode, this.resolver.address)
    this.registrars[tld] = await this.deploy(
      'FIFSRegistrar',
      FIFSRegistrar,
      this.ens.address,
      ethNode
    )
    await this.ens.setOwner(ethNode, this.registrars[tld].address)
  }

  async registerReverseRegistrar() {
    await this.registerTLD('reverse')
    const label = 'addr'
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
    this.registrars['addr.reverse'] = await this.deploy(
      'ReverseRegistrar',
      ReverseRegistrar,
      this.ens.address,
      this.resolver.address
    )
    await this.registrars.reverse.register(
      labelHash,
      this.registrars['addr.reverse'].address
    )
  }

  async registerDomain(label: string, domain: string) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
    const newDomain = `${label}.${domain}`
    const node = namehash(newDomain)
    const address = await this.deployer.signer.getAddress()
    await this.registrars[domain].register(labelHash, address)
    await this.ens.setResolver(node, this.resolver.address)
    this.registrars[newDomain] = await this.deploy(
      'FIFSRegistrar',
      FIFSRegistrar,
      this.ens.address,
      node
    )
    await this.ens.setOwner(node, this.registrars[newDomain].address)
    return this.registrars[newDomain]
  }

  async registerAddress(label: string, domain: string, address: string) {
    const node = namehash(`${label}.${domain}`)
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label))
    const signerAddress = await this.deployer.signer.getAddress()
    await this.registrars[domain].register(hashLabel, signerAddress)
    await this.ens.setResolver(node, this.resolver.address)
    await this.resolver.setAddr(node, address)
  }

  async registerAddressWithReverse(
    label: string,
    domain: string,
    wallet: ethers.Wallet
  ) {
    await this.registerAddress(label, domain, wallet.address)
    this.registrars['addr.reverse']
      .connect(wallet)
      .setName(`${label}.${domain}`)
  }

  async bootstrapWith(label: string, domain: string) {
    await this.bootstrap()
    await this.registerTLD(domain)
    await this.registerReverseRegistrar()
    await this.registerDomain(label, domain)
    return this.ens
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
