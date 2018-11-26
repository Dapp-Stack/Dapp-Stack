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

Expected directories:
* contracts
* * src
* * security

### Passing contracts as arguments

```js
import * as security from "@dapp-stack/security";

security.run(["SimpleStorage.sol"])
```

### With environment file

We will read the contracts array from the environment file.
See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more details about it.

```js
import * as security from "@dapp-stack/security";

security.run()
```