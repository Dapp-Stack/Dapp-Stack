# `@dapp-stack/security`

This package allows you check the security of your contracts.
Under the hood it uses [mythril-classic](https://github.com/ConsenSys/mythril-classic)

This packages requires [Docker](https://www.docker.com) to be installed and running.

## Installation

```sh
# Yarn
yarn add @dapp-stack/security

# NPM
npm install @dapp-stack/security
```

## Usage

Required directories:
```
my-dapp
└── contracts
    └── src
```

The  output will be in `my-dapp/contracts/security`

```js
import * as security from "@dapp-stack/security";

security.run("/code/simple-react/contracts/src/SimpleStorage.sol")
```

If you call the function `security.run`
without any arguments, we will try to fetch the contracts from the environment file
at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.
