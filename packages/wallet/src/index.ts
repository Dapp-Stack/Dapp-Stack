import { connect } from "@solon/web3-wrapper";
import { Environment } from "@solon/environment";
import { Account } from 'web3/eth/accounts';
import * as bip39 from 'bip39';

export const generateWallet = (environment: Environment): Promise<Account[]> => {
  return new Promise<Account[]>(async (resolve, reject) => {
    if (!environment.wallet) {
      return resolve();
    }
    try {
      const entropy = bip39.mnemonicToEntropy(environment.wallet.mnemonic);
      const web3 = await connect();
      const wallet = web3.eth.accounts.wallet.create(environment.wallet.numAccount, entropy);
      resolve(wallet);
    } catch(error) {
      console.log(error)
      reject(error);
    }
  });
}