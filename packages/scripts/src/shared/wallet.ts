import { Environment } from '@solon/environment';
import { generateWallet } from '@solon/wallet';
import { Signale } from 'signale';

export async function generateWalletAsync(environment: Environment): Promise<void> {
  const signale = new Signale({ scope: 'Wallet' });
  signale.await('Generating Wallet...');
  try {
    await generateWallet(environment);
    signale.success('Wallet generated');
  } catch (error) {
    signale.error(error);
  }
}
