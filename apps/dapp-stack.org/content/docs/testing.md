---
id: testing
title: Testing
permalink: docs/testing.html
layout: docs
---

The command to run the test:

Using npm
```bash
npm run das test
```

Using yarn
```bash
yarn das test
```

This command will:

* Ethereum: Starts or connects to an ethereum node.
* Ipfs: Starts an Ipfs daemon
* Compiler: Compiles the contracts and displays warnings or errors if there is any
* Run the Smart Contracts test

The tests must be located in `contracts/tests` and a simple test looks like:

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

As you can see, we deploy the contract using the deployer from the before hook. Then we call the contract function and assert the result as we would normally do with any other language.

Example of output:

```bash
$ dapp-stack-scripts test
[Ethereum] › …  awaiting  Starting geth...
[Ethereum] › ✔  success   Geth is running
[Compiler] › …  awaiting  Starting to compile the contracts
[Compiler] › ✔  success   Contracts compiled


  SimpleStorage
[Connection] › ✔  success   Successfully connected to Ethereum.
[Wallet] › ✔  success   Dev Wallet:
[Wallet] › ✔  success   Address: 0x08633fc5D584115590074A53831d519BF53CA17e
[Wallet] › ✔  success   Balance: 115792089237316195423570985008687907853269984665640564039457.584007913129639927 Eth
[Deployer] › …  awaiting  Starting to deploy ethererum contracts by running migrate...
[Deployer] › …  awaiting  Deploying SimpleStorage...
[Deployer] › ✔  success   
[Deployer] › ✔  success   Contract deployed: SimpleStorage
[Deployer] › ✔  success   ==================================
[Deployer] › ✔  success   Address: 0x46da4d82A73F4fdb1319ab9E92f2F417b8B00674
[Deployer] › ✔  success   Block number: 1225
[Deployer] › ✔  success   Transaction hash: 0x0d75dfd52803451f183c1af18fb2010f65019d76a0ac74960b9c306b1a92e8dc
[Deployer] › ✔  success   Gas used: 452670
[Deployer] › ✔  success   
[Deployer] › ✔  success   Ethererum contracts have been deployed
    ✓ sets default value
    ✓ allow to change the value


  2 passing (133ms)

✨  Done in 4.47s.
```

### Smart Contract Coverage

DApp Stack ships with a code coverage tool for your solidity contracts, in order to enable it, you just have to set
the COVERAGE environment variable as follow:

Using npm
```bash
COVERAGE=true npm run das test
```

Using yarn
```bash
COVERAGE=true yarn das test
```

It will produce an html report at `contracts/coverage/index.html`

> WARNING: Because we change the constant call to non-constant, you will have to adapt your test as the result won't be
> the same

#### How it works

In order to keep track of the code coverage, we instrument your contracts by adding events. We also change all the constant function to non-constant, that allow us to also get coverage for call that usually don't trigger transaction.

You can find the instrumented contracts at `contracts/coverage/index.html`