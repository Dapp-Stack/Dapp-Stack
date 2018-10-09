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
      // await deployer.ens.bootstrapWith('simple', 'eth');
      let contract = await deployer.deploy('SimpleStorage', 10);
    }
  }
};