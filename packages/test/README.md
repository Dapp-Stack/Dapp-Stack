# `@dapp-stack/test`

Simple test runner for solidity contracts

## Installation

```sh
# Yarn
yarn add @dapp-stack/test

# NPM
npm install @dapp-stack/test
```

## Usage

Required directories:
```
my-app
└── contracts
    |── tests
    └── src
```

First, you will need to write a test file in `my-app/contracts/tests/`:

```js
const chai = require('chai');
const { setup } = require('@dapp-stack/test');

const { expect } = chai;

describe('SimpleStorage', () => {
  let simpleStorage, tester, accounts;
  const initialValue = '10';

  before(async () => {
    await setup(async deployer => {
      simpleStorage = await deployer.deploy('SimpleStorage', initialValue);
    })
  });

  it('sets default value', async () => {
    expect((await simpleStorage.get()).eq(10)).to.eq(true);
  });

  it('allow to change the value', async () => {
    await simpleStorage.set(20);
    expect((await simpleStorage.get()).eq(20)).to.eq(true);
  });
});
```

In order to run the test, you will need to have your contracts compiled
and an ethereum node running.

Then you will be able to run the following:

```js
const { run } = require('@dapp-stack/test');

run();
```