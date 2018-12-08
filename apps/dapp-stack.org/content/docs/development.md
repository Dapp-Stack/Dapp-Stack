---
id: development
title: Development
permalink: docs/development.html
layout: docs
---

The command to start the development mode:

Using npm
```bash
npm run das start
```

Using yarn
```bash
yarn das start
```

You will then see something similar to the following trace:

```bash
yarn run v1.12.3
$ dapp-stack-scripts start
[Ethereum] › …  awaiting  Starting geth...
[Ethereum] › ✔  success   Geth is running
[Ipfs] › …  awaiting  Starting ipfs...
[Ipfs] › ✔  success   Ipfs is running
[Compiler] › …  awaiting  Starting to compile the contracts
[Compiler] › ✔  success   Contracts compiled
[Connection] › ✔  success   Successfully connected to Ethereum.
[Wallet] › ✔  success   Dev Wallet:
[Wallet] › ✔  success   Address: 0x08633fc5D584115590074A53831d519BF53CA17e
[Wallet] › ✔  success   Balance: 115792089237316195423570985008687907853269984665640564039457.584007913129639927 Eth
[Wallet] › …  awaiting  Generating private key...
[Wallet] › ✔  success   Private key: 6a0d2769d48e63b2a22187864152547c083bfc2a5697e558b780e9bf8c464fea
[Deployer] › …  awaiting  Starting to deploy ethererum contracts by running migrate...
[Deployer] › …  awaiting  Deploying SimpleStorage...
[Deployer] › ✔  success   
[Deployer] › ✔  success   Contract deployed: SimpleStorage
[Deployer] › ✔  success   ==================================
[Deployer] › ✔  success   Address: 0x24c894C95e54D233aAB4aDCA2F43218ca02F353c
[Deployer] › ✔  success   Block number: 1224
[Deployer] › ✔  success   Transaction hash: 0x8efa3ab5ea16c47e3496f5d6308b7a6d69bafaded2d7aa87c11af1f6553b8d65
[Deployer] › ✔  success   Gas used: 452670
[Deployer] › ✔  success   
[Deployer] › ✔  success   Ethererum contracts have been deployed
[Watcher] › ✔  success   Watcher started.
[Web] › …  awaiting  Starting react-scripts...
[Web] › ℹ  info      Starting the development server...
```

As you can see each component of DApp Stack is logging useful information.
Let's go through all components one by one:

* Ethereum: Starts or connects to an ethereum node.
* Ipfs: Starts an Ipfs daemon
* Compiler: Compiles the contracts and displays warnings or errors if there is any
* Connection: Checks that we successfully connect to the ethereum node
* Wallet: Displays information about your wallet: balance, private key (only for dev network) and address
* Deployer: Deploys the contract and display the result
* Watcher: Watches any change to the contracts and recompiles/redeploys them if needed
* Web: Starts the web framework of your choice
