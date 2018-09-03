module.exports = {
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
    },
  },
  web: true,
  deploy: {
    contracts: [
      "SimpleStorage.sol"
    ],
    migrate: async () => {
      let contract = await deploy(this.contracts[0], { args: [10] });
      console.log(contract.address)
    }
  }
};