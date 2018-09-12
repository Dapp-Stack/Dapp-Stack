import * as spawn from 'cross-spawn';
import * as path from 'path';
import { Signale } from 'signale';

export function startWeb() {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Starting web...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  const child = spawn('node', [reactScriptsPath, 'start']);

  child.stdout.on('data', (data: Buffer) => {
    signale.info(data.toString('utf-8'));
  });
}

export function buildWeb() {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Building web...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  const child = spawn('node', [reactScriptsPath, 'build']);

  child.stdout.on('data', (data: Buffer) => {
    signale.info(data.toString('utf-8'));
  });
}

export function eject() {
  const signale = new Signale({ scope: 'Web' });
  signale.await('Starting to eject...');
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  const child = spawn('node', [reactScriptsPath, 'eject']);

  child.stdout.on('data', (data: Buffer) => {
    signale.info(data.toString('utf-8'));
  });
}
