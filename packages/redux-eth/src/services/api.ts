import Web3 = require('web3');
import { Provider } from 'web3/providers';
import Contract from 'web3/eth/contract';
import contracts from '~/contracts/tracker';

interface EthereumProvider extends Provider {
  enable(): Promise<void>;
};

declare global {
  interface Window { 
    web3?: Web3;
    ethereum?: EthereumProvider
  }
}

export const connect = () => {
  return new Promise<Web3>(async (resolve, reject) => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        return resolve(window.web3);
      } catch (error) {
        return reject(error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return resolve(window.web3);
    } else {
      return reject(new Error('Non-Ethereum browser detected. You should consider trying MetaMask!'));
    }
  });
}

export const getAccounts = (web3: Web3) => {
  return web3.eth.getAccounts();
}

export const setDefaultAccount = (web3: Web3, defaultAccount: string) => {
  web3.eth.defaultAccount = defaultAccount;
}

export const getTransactionCount = (web3: Web3, address: string) => {
  return web3.eth.getTransactionCount(address);
}

export const getNetwork = (web3: Web3) => {
  return web3.eth.net.getId();
}

export const getBlockNumber = (web3: Web3) => {
  return web3.eth.getBlockNumber();
}

export const getBlock = (web3: Web3, number: number) => {
  return web3.eth.getBlock(number, true);
}

export const getContracts = (web3: Web) => {
  return new Promise<Contract[]>((resolve, reject) => {

    resolve([new web3.eth.Contract()])
  });
}