import { Storage } from '@solon/environment';
import { Signale } from 'signale';
import { IStorageStrategy } from '../types';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import { ChildProcess } from 'child_process';

export class Ipfs implements IStorageStrategy {
  private config: Storage;
  private signale: Signale;
  private binaryPath: string;
  private childProcess?: ChildProcess;
  private logStream: fs.WriteStream;

  constructor(config: Storage, signale: Signale) {
    this.config = config;
    this.signale = signale;
    this.binaryPath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '.bin', 'ipfs');

    fs.ensureDirSync(path.join(process.cwd(), 'logs'));
    this.logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'ipfs.log'));
  }

  private init = () => {
    spawn.sync(this.binaryPath, ['init']);
  };

  private daemon = () => {
    this.childProcess = spawn(this.binaryPath, ['daemon'], { stdio: 'pipe' });
    this.childProcess.stdout.pipe(this.logStream);
    this.childProcess.stderr.pipe(this.logStream);
  };

  start = () => {
    this.signale.await('Starting ipfs...');
    return new Promise<boolean>(resolve => {
      this.init();
      this.daemon();
      this.signale.success('Ipfs is running');
      resolve(true);
    });
  };

  stop = () => {
    return new Promise<boolean>(resolve => {
      this.childProcess && this.childProcess.kill();
      resolve(true);
    });
  };
}
