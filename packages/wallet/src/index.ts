import { connect } from '@solon/connect';
import { build } from '@solon/environment';
import * as ethers from 'ethers';

export interface WalletEnhanced {
  provider?: ethers.providers.JsonRpcProvider;
  signer?: ethers.Signer;
  address?: string;
  balance: ethers.utils.BigNumber;
}

export const generateWallet = async (): Promise<WalletEnhanced> => {
  const ethereum = build().services.ethereum;
  if (!ethereum) {
    return { balance: new ethers.utils.BigNumber(0) };
  }
  const provider = connect();

  if (ethereum.network === 'dev') {
    const addresses = await provider.listAccounts();
    const address = addresses[0];
    const balance = await provider.getBalance(address);
    const signer = provider.getSigner();
    return { provider, address, balance, signer };
  }

  if (ethereum.mnemonic) {
    const wallet = ethers.Wallet.fromMnemonic(ethereum.mnemonic).connect(provider);
    const balance = await wallet.getBalance();
    return { address: wallet.address, signer: wallet, balance, provider };
  }

  return { provider, balance: new ethers.utils.BigNumber(0) };
};
