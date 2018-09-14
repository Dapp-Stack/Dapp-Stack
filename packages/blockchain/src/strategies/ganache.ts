import { Blockchain } from '@solon/environment';
import * as GanacheCore from 'ganache-core';
import { Signale } from 'signale';
import { IBlockchainStrategy } from '../types';


export class Ganache implements IBlockchainStrategy {
  private config: Blockchain;
  private signale: Signale;

  constructor(config: Blockchain, signale: Signale) {
    this.config = config;
    this.signale = signale;
  }

  start = () => {
    const options = { mnemonic: this.config.ganache && this.config.ganache.mnemonic };
    const server = GanacheCore.server(options);
    this.signale.await('Starting ganache...')
    return new Promise<boolean>((resolve, reject) => {
      server.listen(8545, (error: Error) => {
        if(error) {
          this.signale.error(error);
          reject(error);
        }
        this.signale.success('Ganache is running')
        resolve(true);
      });
    });
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  }
}
