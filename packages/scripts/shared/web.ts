import * as spawn from 'cross-spawn';
import * as path from 'path';
import { Signale } from 'signale';

export function startWeb() {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Starting web...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  const child = spawn('node', [reactScriptsPath, 'start'], { stdio: 'pipe' });

  child.stdout.on('data', (data: Buffer) => {
    data.toString('utf-8').trim().split("\n").forEach(line => signale.info(line))
  });
}

export function buildWeb() {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Building web...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  const child = spawn('node', [reactScriptsPath, 'build'], { stdio: 'pipe' });

  child.stdout.on('data', (data: Buffer) => {
    data.toString('utf-8').trim().split("\n").forEach(line => signale.info(line))
  });
}

export function eject() {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Starting to eject...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  spawn.sync('node', [reactScriptsPath, 'eject'], { stdio: [process.stdin, process.stdout, process.stderr] });
}
