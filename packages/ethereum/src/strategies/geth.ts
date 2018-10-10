import { Ethereum } from '@solon/environment';
import { ChildProcess } from 'child_process';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Signale } from 'signale';
import * as ethers from 'ethers';

import { IEthereumStrategy } from '../types';

let child: ChildProcess;

export class Geth implements IEthereumStrategy {
  private config: Ethereum;
  private signale: Signale;
  private binaryPath: string;
  private dataDir: string;
  private logStream: fs.WriteStream;

  constructor(config: Ethereum, signale: Signale) {
    this.config = config;
    this.signale = signale;
    this.binaryPath = path.resolve(__dirname, '..', '..', '..', 'bin', 'geth');
    this.dataDir = path.join(process.cwd(), '.geth');
    fs.ensureDirSync(this.dataDir);
    fs.ensureDirSync(path.join(process.cwd(), 'logs'));
    this.logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'geth.log'));
  }

  start = () => {
    this.signale.await('Starting geth...');
    return new Promise<boolean>(async resolve => {
      this.init();
      this.daemon();
      this.signale.success('Geth is running');
      resolve(true);
    });
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      child && child.kill();
      resolve(true);
    });
  }

  console = () => {
    let attachTo: string = '';
    switch (this.config.network) {
      case 'dev':
        attachTo = path.join(this.dataDir, 'geth.ipc');
      case 'ganache':
        attachTo = 'http://127.0.0.1:8545';
      default:
        attachTo = `https://${this.config.network}.infura.io/${this.config.apiKey || ''}`;
    }

    spawn.sync(this.binaryPath, ['attach', attachTo], { stdio: [process.stdin, process.stdout, process.stderr] });
  }

  private command = (): string[] => {
    return [
      '--dev',
      '--datadir',
      this.dataDir,
      '--ws',
      '--wsaddr',
      '0.0.0.0',
      '--wsorigins',
      '*',
      '--wsport',
      '8546',
      '--rpc',
      '--rpcapi',
      'db,personal,eth,net,web3',
      '--rpcaddr',
      '0.0.0.0',
      '--rpcport',
      '8545',
      '--rpccorsdomain',
      '*',
      '--nodiscover',
    ];
  }

  private init = () => {
    spawn.sync(this.binaryPath, this.command().concat('init'));
  }

  private daemon = () => {
    child = spawn(this.binaryPath, this.command(), { stdio: 'pipe' });
    child.stdout.pipe(this.logStream);
    child.stderr.pipe(this.logStream);
  }
}
