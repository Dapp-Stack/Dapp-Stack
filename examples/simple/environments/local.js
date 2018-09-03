const environment = require('@solon/environment');

module.exports = environment.buildEnvironment({
  services: {
    geth: {
      genesis: true,
      type: 'dev'
    },

    ipfs: true,

    compile: {
      solc: {
        version: '0.24.0'
      },
    }
  },
  deploy: {
    contracts: [
      "SimpleStorage.sol"
    ],
    migrate: async () => {
      let contract = await deploy(this.contracts[0], { args: [10] });
      console.log(contract.address)
    }
  }
});