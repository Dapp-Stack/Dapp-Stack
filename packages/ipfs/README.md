# `@dapp-stack/ipfs`

This package allows you to start/stop a local IPFS node.

## Installation

```sh
# Yarn
yarn add @dapp-stack/ipfs

# NPM
npm install @dapp-stack/ipfs
```

## Usage

```js
import * as ipfs from "@dapp-stack/ipfs";

ipfs.start(true)
ipfs.stop(true)
```

If you call the function `ipfs.start` or `ipfs.stop`
without any arguments, we will try to fetch the network from the environment file
at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.