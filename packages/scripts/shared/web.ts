import * as child_process from 'child_process';
import * as spawn from 'cross-spawn';
import * as path from 'path';
import { Signale } from 'signale';

let child: child_process.ChildProcess;

const signale = new Signale({ scope: 'Web' });
const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');

export const startWeb = () => {;
  signale.await('Starting web...');
  child = spawn('node', [reactScriptsPath, 'start'], { stdio: 'pipe' });

  child.stdout.on('data', (data: Buffer) => {
    data
      .toString('utf-8')
      .trim()
      .split('\n')
      .forEach(line => signale.info(line));
  });
}

export const buildWeb = () => {
  signale.await('Building web...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  child = spawn('node', [reactScriptsPath, 'build'], { stdio: 'pipe' });

  child.stdout.on('data', (data: Buffer) => {
    data
      .toString('utf-8')
      .trim()
      .split('\n')
      .forEach(line => signale.info(line));
  });

  return new Promise<void>(resolve => {
    child.on('exit', () => {
      resolve();
    })
  })
}

export const testWeb = () => {
  spawn.sync('node', [reactScriptsPath, 'test', '--env=jsdom'], { stdio: [process.stdin, process.stdout, process.stderr] });
}

export const ejectWeb = () => {
  spawn.sync('node', [reactScriptsPath, 'eject'], { stdio: [process.stdin, process.stdout, process.stderr] });
}

export const stopWeb = () => {
  child && child.kill();
}
