const { getAccounts } = require("./lib/utils");
const { deploy } = require("./lib/deployer");

const contracts = [
  "Wallet/MultiSigWallet.sol",
  "Apps/SimpleStorage.sol"
];

const private = async function() {
  let contract = await deploy(contracts[1], {args: [10]});
};

const ropsten = async function() {

};

const rinkeby = async function() {

};

const frontier = async function() {

};

module.exports = {
  contracts,
  private,
  ropsten,
  rinkeby,
  frontier
};
