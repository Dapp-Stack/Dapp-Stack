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
      let contract = await deployer.deploy('SimpleStorage', { args: [10] });
    }
  }
};