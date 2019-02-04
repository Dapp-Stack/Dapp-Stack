# `@dapp-stack/environment`

This package allows you to build your environment and verify that it is conform.

## Installation

```sh
# Yarn
yarn add @dapp-stack/environment

# NPM
npm install @dapp-stack/environment
```

## Usage

Example of directory structure:

```sh
my-dapp
├── environments
    ├── local.js
    ├── rinkeby.js
    ├── mainnet.js
    └── test.js
```

```js
import * as env from "@dapp-stack/environment";

const environment = env.build()
```

The name of the file that is read come from the environment variable:
`DAPP_ENV`

If not set, `local` will be used.

If empty, the environment returned will be:

```js
const defaultEnvironment = {
  ethereum: {
    network: 'dev',
    migrate () { return new Promise(resolve => resolve()) }
  },
  ipfs: false,
  web: {
    framework: 'create-react-app',
    deploy: 'ipfs'
  },
  compile: {
    solidity: {
      "latest": [
        "SimpleStorage.sol"
      ]
    }
  }
}
```
