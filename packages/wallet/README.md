# `@dapp-stack/wallet`

Generate a wallet based on network and mnemonic.

## Installation

```sh
# Yarn
yarn add @dapp-stack/wallet

# NPM
npm install @dapp-stack/wallet
```

## Usage

```js
import * as wallet from "@dapp-stack/wallet";

wallet.generateWallet("roptsten", "fault jeans unknown rain cherry cheese luggage number feature devote crack bottom")
```

The network argument can be one of the following:

- `homestead`
- `rinkeby`
- `ropsten`
- `kovan`
- `dev`
- `external`

If `dev` or `external` it will try to connect using:
`http://localhost:8545`

otherwise we will use infura.

The second parameter which is optional is the mnemonic.

In case of `dev` network, we will return a wallet with ether in it,
you don't need to pass a mnemonic. This is only needed in case of public network.

If you want to give yourself some ether you can use a faucet such as (https://faucet.ropsten.be)[https://faucet.ropsten.be]

If you call the function `wallet.generateWallet`
without any arguments, we will try to fetch the web framework or deploy strategy
from the environment file at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.
