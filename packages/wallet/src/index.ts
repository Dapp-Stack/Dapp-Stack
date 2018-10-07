import { connect } from '@solon/connect';
import { build } from '@solon/environment';
import * as ethers from 'ethers';

export const generateWallet = () => {
  const walletConfig = build().deploy.wallet;
  const provider = connect();
  const path = `m/44’/60’/${walletConfig.indexAccount}’/0/0`;
  const wallet = ethers.Wallet.fromMnemonic(walletConfig.mnemonic, path);
  return wallet.connect(provider);
};
