import * as child_process from 'child_process';
import * as spawn from 'cross-spawn';
import * as path from 'path';
import { Signale } from 'signale';

let child: child_process.ChildProcess;

export const startWeb = () => {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Starting web...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
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
  const signale = new Signale({ scope: 'Web' });
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

export const ejectWeb = () => {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Starting to eject...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  spawn.sync('node', [reactScriptsPath, 'eject'], { stdio: [process.stdin, process.stdout, process.stderr] });
}

export const stopWeb = () => {
  child && child.kill();
}
