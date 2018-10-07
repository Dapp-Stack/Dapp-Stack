module.exports = {
  compile: {
    contracts: [
      "SimpleStorage.sol"
    ]
  },
  services: {
    ipfs: 'ipfs'
  },
  deploy: {
    migrate: async (deployer) => {
      let contract = await deployer.deploy('SimpleStorage', null, 10);
    }
  }
};