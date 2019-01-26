import { Structure, WebFramework, Maybe } from '@dapp-stack/environment'
import * as fs from 'fs-extra'
import * as path from 'path'
import Contract from 'web3/eth/contract'
import Web3 = require('web3')
import { ContractCoverage } from './contractCoverage'
import { Coverage as ICoverage } from './types'

export class Coverage {
  private contracts: ContractCoverage[] = []
  private deployedContracts: Contract[] = []
  private web3: Web3 = new Web3()
  private chainId: number = 0
  private fromBlockNumber: number = 0

  async setup(contracts: string[]) {
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider('ws://localhost:8546')
    )
    this.chainId = await this.web3.eth.net.getId()
    this.fromBlockNumber = await this.web3.eth.getBlockNumber()

    fs.ensureDirSync(Structure.contracts.coverage)

    fs.copySync(Structure.contracts.realSrc, Structure.contracts.src)

    contracts.forEach(contract => {
      const contractCoverage = new ContractCoverage(contract)
      contractCoverage.instrument()
      this.contracts.push(contractCoverage)
    })
  }

  async registerContracts(framework: Maybe<WebFramework>) {
    const tracker = Structure.tracker(framework)
    const trackerData = fs.readJsonSync(tracker)
    const deployedContracts = trackerData[this.chainId]

    Object.keys(deployedContracts).forEach(address => {
      const abi = deployedContracts[address].abi
      this.deployedContracts.push(new this.web3.eth.Contract(abi, address))
    })
  }

  async finish() {
    await Promise.all(this.collectEvents())

    const coverageReport = this.contracts.reduce(
      (acc: { [name: string]: ICoverage }, contract) => {
        acc[contract.name] = contract.coverage
        return acc
      },
      {}
    )

    const coveragePath = path.join(
      Structure.contracts.coverage,
      'coverage.json'
    )
    fs.writeFileSync(coveragePath, JSON.stringify(coverageReport, null, 2))
  }

  private collectEvents() {
    return this.deployedContracts.map(async deployedContract => {
      const events = await deployedContract.getPastEvents('allEvents', {
        fromBlock: this.fromBlockNumber
      })
      this.contracts.forEach(contract => contract.updateCoverage(events))
    })
  }
}
