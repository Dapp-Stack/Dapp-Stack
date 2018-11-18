import { Ethereum, Structure, Web, Maybe } from '@solon/environment';
import * as ethers from 'ethers';
import * as fs from 'fs-extra';
import { glob } from 'glob';
import * as path from 'path';
import { Signale } from 'signale';

import { Tracker } from './tracker';
import { EnsBuilder } from './ensBuilder';
import { Erc20 } from './erc20';
import { Erc721 } from './erc721';

export class EthererumDeployer {
  public contracts!: string[];
  public signer: ethers.Signer;
  public network!: ethers.utils.Network;
  public gasPrice!: ethers.utils.BigNumber;
  public tracker!: Tracker;
  public ens: EnsBuilder;
  public erc20: Erc20;
  public erc721: Erc721;
  private readonly config: Ethereum;
  private readonly webConfig: Web;
  private readonly signale: Signale;
  private contractFiles!: { [basename: string]: string };

  constructor(config: Ethereum, webConfig: Web, signer: ethers.Signer) {
    this.config = config;
    this.webConfig = webConfig;
    this.signer = signer;
    this.ens = new EnsBuilder(this);
    this.erc20 = new Erc20(this);
    this.erc721 = new Erc721(this);
    this.signale = new Signale({ scope: 'Deployer' });
  }

  initialize = async () => {
    await this.initializeContracts();
    await this.initializeEthereum();
    this.tracker = new Tracker(this.network, this.webConfig);
  };

  async run(extraMigrate: (deployer: EthererumDeployer) => void) {
    try {
      this.signale.await('Starting to deploy ethererum contracts by running migrate...');
      this.tracker.reset();
      await this.config.migrate(this);
      await extraMigrate(this);
      this.signale.success('Ethererum contracts have been deployed');
    } catch (error) {
      this.signale.error(error);
    }
  }

  attach(contractName: string, address: string): ethers.Contract {
    if (!this.contractFiles) {
      throw new Error('Unexpected Error: solon is not ready');
    }

    const contractFile = this.contractFiles[contractName];
    if (!contractFile) {
      throw new Error(`Contract not found: ${contractName}`);
    }

    const source = JSON.parse(fs.readFileSync(contractFile).toString());
    this.tracker.update(contractName, address, JSON.stringify(source.abi));
    return new ethers.Contract(address, source.abi, this.signer);
  }

  async deploy(contractName: string, ...args: any[]): Promise<ethers.Contract> {
    if (!this.contractFiles) {
      throw new Error('Unexpected Error: solon is not ready');
    }

    const contractFile = this.contractFiles[contractName];
    if (!contractFile) {
      throw new Error(`Contract not found: ${contractName}`);
    }

    const source = JSON.parse(fs.readFileSync(contractFile).toString());

    const abi = source.abi;
    const bytecode = `0x${source.evm.bytecode.object}`;
    const factory = new ethers.ContractFactory(abi, bytecode, this.signer);
    return this.deployContractFactory(contractName, factory, ...args);
  }

  async deployContractFactory(contractName: string, factory: ethers.ContractFactory, ...args: any[]) {
    const contract = await factory.deploy(...args);
    await contract.deployed();

    this.tracker.update(contractName, contract.address, JSON.stringify(factory.interface.abi));
    const receipt = await contract.deployTransaction.wait(1);
    this.printResult(contractName, contract, receipt);
    return contract;
  }

  private readonly initializeContracts = () => {
    return new Promise<void>(resolve => {
      glob(`${Structure.contracts.build}/**/*.json`, {}, (_, files: string[]) => {
        this.contractFiles = files.reduce((acc: { [basename: string]: string }, file) => {
          acc[path.basename(file, '.json')] = file;
          return acc;
        }, {});
        this.contracts = Object.keys(this.contractFiles);
        resolve();
      });
    });
  };

  private readonly initializeEthereum = async () => {
    if (this.signer.provider) {
      this.gasPrice = await this.signer.provider.getGasPrice();
      this.network = await this.signer.provider.getNetwork();
    }
  };

  private readonly printResult = (
    contractName: string,
    contract: ethers.Contract,
    receipt: ethers.providers.TransactionReceipt,
  ) => {
    this.signale.success('');
    this.signale.success(`Contract deployed: ${contractName}`);
    this.signale.success(`==================================`);
    this.signale.success(`Address: ${contract.address}`);
    this.signale.success(`Block number: ${receipt.blockNumber}`);
    this.signale.success(`Transaction hash: ${receipt.transactionHash}`);
    this.signale.success(`Gas used: ${receipt.gasUsed}`);
    this.signale.success('');
  };
}
