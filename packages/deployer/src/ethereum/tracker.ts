import { Structure, Web } from '@dapp-stack/environment'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as lockfile from 'proper-lockfile'
import { ethers } from 'ethers'

interface ITrackerData {
  [network: number]: {
    [address: string]: {
      name: string
      abi: string
    }
  }
}

export class Tracker {
  private readonly network: ethers.utils.Network
  private readonly filename: string

  constructor(network: ethers.utils.Network, webConfig: Web) {
    this.network = network
    this.filename = Structure.tracker(webConfig.framework)
  }

  reset = () => {
    this.whileLock((data: ITrackerData) => {
      data[this.network.chainId] = {}
    })
  }

  update = (name: string, address: string, abi: string) => {
    this.whileLock((data: ITrackerData) => {
      data[this.network.chainId][address] = { name, abi }
    })
  }

  private readonly whileLock = (execution: Function) => {
    fs.ensureFileSync(this.filename)
    try {
      lockfile.lockSync(this.filename)
      const content = fs.readFileSync(this.filename).toString('utf-8') || '{}'
      const data: ITrackerData = JSON.parse(content)
      execution(data)
      fs.writeJSONSync(this.filename, data)
    } finally {
      lockfile.unlockSync(this.filename)
    }
  }
}
