import { connect } from '@solon/connect';
import { build } from '@solon/environment';
import * as ethers from 'ethers';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as keythereum from 'keythereum';
import { Signale } from 'signale';

const signale = new Signale({ scope: 'Wallet' });

export interface WalletEnhanced {
  provider?: ethers.providers.JsonRpcProvider;
  signer?: ethers.Signer;
  address?: string;
  balance: ethers.utils.BigNumber;
}

export const generateWallet = async (): Promise<WalletEnhanced> => {
  const ethereum = build().ethereum;
  if (!ethereum) {
    return { balance: new ethers.utils.BigNumber(0) };
  }
  const provider = connect(ethereum.network);

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

export const exportPrivateKey = () => {
  const ethereum = build().ethereum;
  if (!ethereum) {
    signale.error('Ethereum node is not enabled');
    return;
  }

  if (ethereum.network !== 'dev') {
    signale.error('Ethereum node is not development and as such not using geth');
    return;
  }

  signale.await('Generating private key from json key file');
  const keystore = path.join(process.cwd(), '.geth', 'keystore');
  fs.readdirSync(keystore).forEach(file => {
    const keyObject = fs.readJSONSync(path.join(keystore, file));
    const privateKey = keythereum.recover('', keyObject);
    signale.success(`File: ${file}, Private Key: ${privateKey.toString('hex')}`);
  });
};
