import { Deploy } from '@solon/environment';
import { connect } from '@solon/web3-wrapper';
import * as bip39 from 'bip39';
import { Account } from 'web3/eth/accounts';
import Web3 = require('web3');

export const generateWallet = (deploy: Deploy): Promise<Web3> => {
  return new Promise<Web3>(async (resolve, reject) => {
    try {
      const web3 = await connect();
      if (!deploy.wallet) {
        return resolve(web3);
      }

      const entropy = bip39.mnemonicToEntropy(deploy.wallet.mnemonic);
      web3.eth.accounts.wallet.create(deploy.wallet.numAccount, entropy);
      resolve(web3);
    } catch (error) {
      reject(error);
    }
  });
};
