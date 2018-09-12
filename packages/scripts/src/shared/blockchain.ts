import { Environment } from '@solon/environment';
import * as ganache from '@solon/ganache';
import * as geth from '@solon/geth';
import { Signale } from 'signale';

export function startConsole(environment: Environment): Promise<void> | undefined {
  const { ganache, geth, infura } = environment.services;
  if (geth) {
    return startGethConsoleAsync(environment);
  }

  return;
}

export function start(environment: Environment): Promise<void> | undefined {
  const { ganache, geth, infura } = environment.services;
  if (geth) {
    return startGethAsync(environment);
  }

  if (ganache) {
    return startGanacheAsync(environment);
  }
  return;
}

export function stop(environment: Environment): Promise<void> | undefined {
  const { ganache, geth, infura } = environment.services;
  if (geth) {
    return stopGethAsync();
  }

  return;
}

async function startGethAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Blockchain' });
  signale.await('Starting geth client...');
  try {
    await geth.start(environment);
    signale.success('Geth client is running');
  } catch (error) {
    signale.error(error);
  }
}

async function startGanacheAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Blockchain' });
  signale.await('Starting ganache...');
  try {
    await ganache.start(environment);
    signale.success('ganache is running');
  } catch (error) {
    signale.error(error);
  }
}

async function stopGethAsync(): Promise<void> {
  const signale = new Signale({ scope: 'Blockchain' });
  try {
    await geth.stop();
  } catch (error) {
    signale.error(error);
  }
}

async function startGethConsoleAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Blockchain' });
  signale.await('Starting geth console...');
  try {
    await geth.console(environment);
  } catch (error) {
    signale.error(error);
  }
}
