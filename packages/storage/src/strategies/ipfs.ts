import { Storage } from '@solon/environment';
import { Signale } from 'signale';
import { IStorageStrategy } from '../types';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import { ChildProcess } from 'child_process';

export class Ipfs implements IStorageStrategy {
  private config: Storage;
  private signale: Signale;
  private binaryPath: string;
  private childProcess?: ChildProcess;

  constructor(config: Storage, signale: Signale) {
    this.config = config;
    this.signale = signale;
    this.binaryPath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '.bin', 'ipfs');
  }

  init() {
    spawn.sync(this.binaryPath, ['init']);
  }

  start = () => {
    this.signale.await('Starting ipfs...')
    return new Promise<boolean>(resolve => {
      this.init();
      this.childProcess = spawn(this.binaryPath, ['daemon']);
      this.signale.success('Ipfs is running')
      resolve(true);
    });
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      this.childProcess && this.childProcess.kill();
      resolve(true);
    });
  }
}
