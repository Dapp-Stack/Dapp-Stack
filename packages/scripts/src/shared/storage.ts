import { Environment } from '@solon/environment';
import * as ipfs from '@solon/ipfs';
import { Signale } from 'signale';

export async function startIpfsAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Storage' });
  signale.await('Starting ipfs client...');
  try {
    await ipfs.start(environment);
    signale.success('Ipfs client is running');
  } catch (error) {
    signale.error(error);
  }
}

export async function stopIpfsAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Storage' });
  try {
    await ipfs.stop();
  } catch (error) {
    signale.error(error);
  }
}
