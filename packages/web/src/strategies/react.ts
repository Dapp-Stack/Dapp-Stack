import * as child_process from 'child_process';
import * as spawn from 'cross-spawn';
import * as path from 'path';
import { Signale } from 'signale';

import { IWebStrategy } from '../types';

const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');

export class React implements IWebStrategy {
  private signale: Signale;
  private child!: child_process.ChildProcess;

  constructor(signale: Signale) {
    this.signale = signale;
  }

  start = () => {
    this.signale.await('Starting react-scripts...');
    this.child = spawn('node', [reactScriptsPath, 'start'], { stdio: 'pipe' });

    this.child.stdout.on('data', (data: Buffer) => {
      data
        .toString('utf-8')
        .trim()
        .split('\n')
        .forEach(line => this.signale.info(line));
    });
  };

  build = () => {
    this.signale.await('Building react-scripts...');
    this.child = spawn('node', [reactScriptsPath, 'build'], { stdio: 'pipe' });
  
    this.child.stdout.on('data', (data: Buffer) => {
      data
        .toString('utf-8')
        .trim()
        .split('\n')
        .forEach(line => this.signale.info(line));
    });
  
    return new Promise<void>(resolve => {
      this.child.on('exit', () => {
        resolve();
      });
    });  
  };

  eject = () => {
    spawn.sync('node', [reactScriptsPath, 'eject'], { stdio: [process.stdin, process.stdout, process.stderr] });
  };

  test = () => {
    spawn.sync('node', [reactScriptsPath, 'test', '--env=jsdom'], {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  };

  stop = () => {
    this.child && this.child.kill();
  };
}

