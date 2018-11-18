import { Structure, Web } from '@solon/environment';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as lockfile from 'proper-lockfile';
import { ethers } from 'ethers';

interface ITrackerData {
  [network: number]: {
    [address: string]: {
      name: string;
      abi: string;
    };
  };
}

export class Tracker {
  private network: ethers.utils.Network;
  private filename: string;

  constructor(network: ethers.utils.Network, webConfig: Web) {
    this.network = network;
    this.filename = Structure.tracker(webConfig.framework);
  }

  reset = () => {
    this.whileLock((data: ITrackerData) => {
      data[this.network.chainId] = {};
    });
  };

  update = (name: string, address: string, abi: string) => {
    this.whileLock((data: ITrackerData) => {
      data[this.network.chainId][address] = { name, abi };
    });
  };

  private whileLock = (execution: Function) => {
    if (this.isTest()) {
      return;
    }

    fs.ensureFileSync(this.filename);
    try {
      lockfile.lockSync(this.filename);
      const content = fs.readFileSync(this.filename).toString('utf-8') || '{}';
      const data: ITrackerData = JSON.parse(content);
      execution(data);
      fs.writeJSONSync(this.filename, data);
    } finally {
      lockfile.unlockSync(this.filename);
    }
  };

  private isTest = () => {
    return process.env.SOLON_ENV === 'test';
  };
}
