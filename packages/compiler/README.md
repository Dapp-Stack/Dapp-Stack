# `@dapp-stack/compiler`

This package allows to compile your solidity contracts.

## Installation

```sh
# Yarn
yarn add @dapp-stack/compiler

# NPM
npm install @dapp-stack/compiler
```

## Usage

Required directories:

```sh
my-dapp
└── contracts
    └── src
```

The  output will be in `my-dapp/contracts/build`

```js
import * as compiler from "@dapp-stack/compiler";

compiler.run(["SimpleStorage.sol"])
```

If you call the function `compiler.run` without any arguments,
we will try to fetch the list contracts to compile from
the environment file at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.
