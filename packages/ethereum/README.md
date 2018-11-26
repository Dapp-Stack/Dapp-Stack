# `@dapp-stack/ethereum`

This package allows you to start/stop a private node or connect to an existing network.

## Installation

```sh
# Yarn
yarn add @dapp-stack/ethereum

# NPM
npm install @dapp-stack/ethereum
```

## Usage

```js
import * as ethereum from "@dapp-stack/ethereum";

ethereum.start("rinkeby")
ethereum.stop("rinkeby")
ethereum.console("rinkeby")
```

The network must be one of the following:
`homestead`, `rinkeby`, `ropsten`, `kovan`, `dev` or `external`

`external` is considered as a noop.