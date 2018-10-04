import Web3 = require('web3');

export const connect = () => {
  return new Web3();
}

export const getAccounts = (web3: Web3) => {
  return web3.eth.getAccounts();
}

export const setDefaultAccount = (web3: Web3, defaultAccount: string) => {
  web3.eth.defaultAccount = defaultAccount;
}