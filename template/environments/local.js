module.exports = {
  compile: {
    contracts: [
      "SimpleStorage.sol"
    ]
  },
  services: {
    ethereum: {
      migrate: async (deployer) => {
        await deployer.ens.bootstrapWith('simple', 'eth');
        let contract = await deployer.deploy('SimpleStorage', 10);
      }
    },
    ipfs: true
  },
};