import { Signale } from 'signale';
import { Environment } from '@solon/environment';
import * as geth from '@solon/geth';
import * as ipfs from '@solon/ipfs';

export async function startGethAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Geth' });
  signale.await('Starting geth client...');
  try {
    await geth.start(environment);
    signale.success('Geth client is running');
  } catch (error) {
    signale.error(error);
  }
}

export async function stopGethAsync(): Promise<void> {
  const signale = new Signale({ scope: 'Geth' });
  try {
    await geth.stop();
  } catch (error) {
    signale.error(error);
  }
}

export async function startConsoleAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Geth' });
  signale.await('Starting geth console...');
  try {
    await geth.console(environment);
  } catch (error) {
    signale.error(error);
  }
}

export async function startIpfsAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Ipfs' });
  signale.await('Starting ipfs client...');
  try {
    await ipfs.start(environment);
    signale.success('Ipfs client is running');
  } catch (error) {
    signale.error(error);
  }
}

export async function stopIpfsAsync(): Promise<void> {
  const signale = new Signale({ scope: 'Ipfs' });
  try {
    await ipfs.stop();
  } catch (error) {
    signale.error(error);
  }
}
