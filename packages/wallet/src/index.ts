import { connect } from '@solon/connect';
import { build } from '@solon/environment';
import * as ethers from 'ethers';

export const generateWallet = () => {
  const walletConfig = build().deploy.wallet;
  const provider = connect();
  const wallet = ethers.Wallet.fromMnemonic(walletConfig.mnemonic);
  return wallet.connect(provider);
};
