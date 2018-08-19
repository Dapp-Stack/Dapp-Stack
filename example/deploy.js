const { deploy } = require("solon-deployer");

// List the contracts you want to compile and deploy
const contracts = [
  "SimpleStorage.sol"
];

// This function is call when you want do deploy on local
const local = async function() {
  let contract = await deploy(contracts[0], { args: [10] });
  console.log(contract.address)
};

// This function is call when you want do deploy on remote
const remote = async function() {

};

module.exports = {
  contracts,
  local,
  remote
};
