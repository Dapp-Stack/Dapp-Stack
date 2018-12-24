# `@dapp-stack/contract-utils`

A set of utility function to manipulate contracts

## Installation

```sh
# Yarn
yarn add @dapp-stack/contract-utils

# NPM
npm install @dapp-stack/contract-utils
```

## Usage

```js
import * as utils from "@dapp-stack/contract-utils";

utils.sourcesPath()
utils.artifactsPath()
utils.findArtifact("SimpleStorage")
utils.artifacts()
utils.sourcesPath().filter(utils.solidityFilter)
utils.sourcesPath().filter(utils.vyperFilter)
```