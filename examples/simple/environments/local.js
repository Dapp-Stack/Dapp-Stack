module.exports = {
  compile: {
    contracts: [
      "SimpleStorage.sol"
    ]
  },
  services: {
    storage: 'ipfs'
  },
  deploy: {
    migrate: async (deployer) => {
      let contract = await deployer.deploy(deployer.contracts[0], { args: [10] });
    }
  }
};