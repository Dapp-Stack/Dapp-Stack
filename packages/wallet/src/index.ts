import { build } from '@solon/environment';
import * as ethers from 'ethers';

export const generateWallet = () => {
  const walletConfig = build().deploy.wallet
  if (!walletConfig) {
    return null;
  }
  return ethers.Wallet.fromMnemonic(walletConfig.mnemonic);
};
