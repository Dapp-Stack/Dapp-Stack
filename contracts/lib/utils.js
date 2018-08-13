const Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const getAccounts = function () {
  return web3.eth.getAccounts();
};

const getGasPrice = function () {
  return web3.eth.getGasPrice();
};

module.exports = {
  web3,
  getAccounts,
  getGasPrice
};

