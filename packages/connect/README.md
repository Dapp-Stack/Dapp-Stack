# `@dapp-stack/connect`

This package allows to connect to ethereum network.

## Installation

```sh
# Yarn
yarn add @dapp-stack/connect

# NPM
npm install @dapp-stack/connect
```

## Usage

```js
import { connect } from "@dapp-stack/connect";

const provider = connect("homestead")
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
