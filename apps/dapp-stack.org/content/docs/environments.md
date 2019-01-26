---
id: environments
title: Environments
permalink: docs/environments.html
---

## What is environements

DApp Stack is greatly inspired from Ruby on Rails and as such everything running with DApp Stack depends of
the environment.

If no environemnt is specified, the default one will be `local`.

The only exception is the `test` command which will use the `test` environment.

In order to switch environment, you will need to specify the `DAPP_ENV` environment variable.

## How it looks like

The default environment file looks like this:

```js
const secrets = require("@dapp-stack/secrets");

// const decryptedSecrets = secrets.decrypt();

module.exports = {
  compile: {
    // List of solidity contracts to compile with version
    solidity: {
      "latest": [
        "SimpleStorage.sol"
      ]
    }

    // List of vyper contracts to compile
    // vyper: [
    // ]

    // Optimize solidity compilation, you can learn more about it here:
    // https://solidity.readthedocs.io/en/v0.4.24/using-the-compiler.html
    // optimizer: {
    //   enabled: false,
    //   runs: 200
    // },
  },

  // Ethererum configuration, it can be false if not needed
  ethereum: {
    // The name of the network you want to start/connect
    // Default value is dev
    // Possible values are: homestead, rinkeby, ropsten, kovan, dev and external
    // In case of external, the expected url will be http://localhost:8545
    // network: 'dev',

    // If the network is public (homestead, rinkeby, ropsten or kovan)
    // you can set your infura API key with this setting.
    // apiKey: decryptedSecrets.rinkeby.infuraApiKey,

    // If the network is public (homestead, rinkeby, ropsten or kovan)
    // the mnemonic is required in order to deploy the contracts.
    // Make sure it is funded.
    // mnemonic: decryptedSecrets.rinkeby.mnemonic,

    // Function executed by DApp Stack to deploy the contracts.
    migrate: async (deployer) => {
      await deployer.ens.bootstrapWith('simple', 'eth');
      await deployer.erc20.bootstrap();
      await deployer.erc721.bootstrap();
      await deployer.deploy('SimpleStorage', 10);
    }
  },

  // IPFS configuration, if can be true or false
  // In case if true, an IPFS daemon will be started at http://localhost:5001
  // Default value is false
  ipfs: true,

  // Web configuration
  web: {
    // The web framework you are using.
    // Default value is create-react-app
    // Possible values are: create-react-app, angular, vue, test, next and false
    framework: false,

    // How to deploy the assets,
    // Default value is ipfs
    // Possible values are: ipfs and false
    deploy: 'ipfs',
  },
};
```

From there you can choose which services to start, which web framework you want to use.
In case of ethereum, you can also elect smart contracts for compilations.

Finally, the migrate function specifies how you want to deploy the contracts.
