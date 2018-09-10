module.exports = {
  services: {
    geth: {
      type: 'dev'
    },

    ipfs: true,

    compile: {
      solc: {
        version: '0.24.0'
      },
    },
  },
  wallet: {
    mnemonic: 'seed sock milk update focus rotate barely fade car face mechanic mercy',
    numAccount: 5,
    wei: 10000000
  },
  web: true,
  deploy: {
    contracts: [
      "SimpleStorage.sol"
    ],
    migrate: async (deployer) => {
      let contract = await deployer.deploy(deployer.contracts[0], { args: [10] });
    }
  }
};