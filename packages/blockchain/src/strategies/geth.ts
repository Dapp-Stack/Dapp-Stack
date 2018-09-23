import { Blockchain } from '@solon/environment';
import { Signale } from 'signale';
import { IBlockchainStrategy } from '../types';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import { ChildProcess } from 'child_process';

let child: ChildProcess;

export class Geth implements IBlockchainStrategy {
  private config: Blockchain;
  private signale: Signale;
  private binaryPath: string;
  private dataDir: string;
  private logStream: fs.WriteStream;

  constructor(config: Blockchain, signale: Signale) {
    this.config = config;
    this.signale = signale;
    this.binaryPath = path.resolve(__dirname, '..', '..', '..', 'bin', 'geth');
    this.dataDir = path.join(process.cwd(), '.geth')
    fs.ensureDirSync(this.dataDir);
    fs.ensureDirSync(path.join(process.cwd(), 'logs'));
    this.logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'geth.log'));
  }

  private command = (): string[] => {
    switch (this.config.geth.type) {
      case 'dev':
        return [
          '--dev',
          '--datadir', this.dataDir,
          '--ws', '--wsaddr', '0.0.0.0', '--wsorigins', '*', '--wsport', '8546',
          '--rpc', '--rpcapi', 'db,personal,eth,net,web3', '--rpcaddr', '0.0.0.0', '--rpcport', '8545', '--rpccorsdomain', '*',
          '--nodiscover',
        ];
      case 'ropsten':
        return [''];
      case 'mainnet':
        return [''];
    }
  }

  private init = () => {
    spawn.sync(this.binaryPath, this.command().concat('init'));
  };

  private daemon = () => {
    child = spawn(this.binaryPath, this.command(), { stdio: 'pipe' });
    child.stdout.pipe(this.logStream);
    child.stderr.pipe(this.logStream);
  };

  start = () => {
    this.signale.await('Starting geth...');
    return new Promise<boolean>(resolve => {
      this.init();
      this.daemon();
      this.signale.success('Geth is running');
      resolve(true);
    });
  };

  stop = () => {
    return new Promise<boolean>(resolve => {
      child && child.kill();
      resolve(true);
    });
  };

  console = () => {
    let attachTo: string = '';
    switch(this.config.provider) {
      case 'geth':
        attachTo = path.join(this.dataDir, 'geth.ipc')
      case 'infura':
        attachTo = this.config.infura.url;
      case 'ganache':
        attachTo = 'http://127.0.0.1:8545';
    }

    spawn.sync(this.binaryPath, ['attach', attachTo], { stdio: [process.stdin, process.stdout, process.stderr] });
  }
}
