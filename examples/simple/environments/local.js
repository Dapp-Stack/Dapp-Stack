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
        await deployer.erc20.bootstrap();
        await deployer.erc721.bootstrap();
        let contract = await deployer.deploy('SimpleStorage', 10);
      }
    },
    ipfs: true
  }
};