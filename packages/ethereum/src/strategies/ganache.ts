import { Etherereum } from '@solon/environment';
import * as GanacheCore from 'ganache-core';
import { Signale } from 'signale';
import { IEtherereumStrategy, GanacheEtherereum } from '../types';

import { GanacheFileLogger } from '../utils/ganacheFileLogger';

export class Ganache implements IEtherereumStrategy {
  private config: Etherereum;
  private signale: Signale;

  constructor(config: Etherereum, signale: Signale) {
    this.config = config;
    this.signale = signale;
  }

  start = () => {
    const logger = new GanacheFileLogger();
    const options = {
      mnemonic: this.config.ganache && this.config.ganache.mnemonic,
      logger,
    };

    const server = GanacheCore.server(options);
    this.signale.await('Starting ganache...');
    return new Promise<boolean>((resolve, reject) => {
      server.listen(8545, (error: Error, ethereum: GanacheEtherereum) => {
        if (error) {
          this.signale.error(error);
          reject(error);
        }
        Object.keys(ethereum.personal_accounts).forEach(publicKey => {
          logger.log(`Public Key: ${publicKey}`);
        });
        this.signale.success('Ganache is running');
        resolve(true);
      });
    });
  };

  stop = () => {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  };
}
