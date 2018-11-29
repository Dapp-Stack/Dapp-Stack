# `@dapp-stack/deployer`

This package allows to deploy your solidity contracts.

## Installation

```sh
# Yarn
yarn add @dapp-stack/deployer

# NPM
npm install @dapp-stack/deployer
```

## Usage

Required directories:

```sh
my-dapp
└── contracts
    |── build
    └── src
```

You will also need an ethereum node started if you decide to connect
to the `dev` network.
If you decide to connect to a public node such as `ropsten` or `mainnet`,
You will need to set the mnemonic in order to have ether in your account.

The suggested way is to use the [@dapp-stack/secrets](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/secrets)
package.

```js
import * as deployer from "@dapp-stack/deployer";

const ethererum = {
  network: "dev",
  migrate: async (deployer) => {
    await deployer.ens.bootstrapWith('simple', 'eth');
    await deployer.erc20.bootstrap();
    await deployer.erc721.bootstrap();
    let contract = await deployer.deploy('SimpleStorage', 10);
  }
};

const web = {
  framework: false;
};

deployer.run(ethererum, web);
```

This configuration will use the `dev` network,
bootstrap ens with "simple.eth" registered,
deploy and erc20 and erc721 token and finally
deploy your contract SimpleStorage initialized at 10.

As a result of the deployment a `tracker.json` file will be created.

It will contains information about the deployed contracts such as the address and the abi.

The contract returns is from type [ethers.Contract](https://docs.ethers.io/ethers.js/html/api-contract.html)

If you call the function `deployer.run` without any arguments,
we will try to fetch the list ethereum and web to compile from
the environment file at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.
