module.exports = {
  compile: {
    contracts: [
      "SimpleStorage.sol"
    ]
  },
  deploy: {
    migrate: async (deployer) => {
      let contract = await deployer.deploy(deployer.contracts[0], { args: [10] });
    }
  }
};