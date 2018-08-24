module.exports = {
  services: {
    geth: {
      genesis: true,
      commandOptions: [
        '--datadir ".ethereum/local"',
        '--networkid "9999"',
        '--ws',
        '--wsaddr "0.0.0.0"',
        '--wsorigins "*"',
        '--wsport "8546"',
        '--rpc',
        '--rpcapi "db,personal,eth,net,web3"',
        '--rpcaddr "0.0.0.0"',
        '--rpcport "8545"',
        '--rpccorsdomain "*"',
        '--mine',
        '--nodiscover',
        '--unlock 0,1,2,3',
        '--password .ethereum/private/passwords'
      ]
    },

    ipfs: true,

    compile: {
      solc: {
        version: '0.24.0',
        commandOptions: [
          '--optimize',
          '--combined-json',
          'abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc',
          '--overwrite'
        ]
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
}