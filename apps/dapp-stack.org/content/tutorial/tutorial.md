---
id: tutorial
title: "Tutorial: Intro to Dapp Stack"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
---

This tutorial doesn't assume any existing DApp Stack knowledge.

## Before We Start the Tutorial

We will build a small file store during this tutorial. The techniques you'll learn in the tutorial are fundamental to building any DApp Stack apps, and mastering it will give you a deep understanding of DApp Stack.

>Tip
>
>This tutorial is designed for people who prefer to **learn by doing**. If you prefer learning concepts from the ground up, check out our [step-by-step guide](/docs/getting-started.html). You might find this tutorial and the guide complementary to each other.

The tutorial is divided into several sections:

* [Setup for the Tutorial](#setup-for-the-tutorial) will give you **a starting point** to follow the tutorial.
* [Overview](#overview) will teach you **the fundamentals** of DApp Stack: Development of the Smart Contract and the Web Application
* [Deploy it](#deploy-it) will teach you **how to deploy** in DApp Stack world.

You don't have to complete all of the sections at once to get the value out of this tutorial. Try to get as far as you can -- even if it's one or two sections.

It's fine to copy and paste code as you're following along the tutorial, but we recommend to type it by hand. This will help you develop a muscle memory and a stronger understanding.

### What Are We Building?

In this tutorial, we'll show how to build a simple file store.

You can see what we'll be building here: **[Final Result](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/apps/simple-react)**.

### Prerequisites

We'll assume that you have some familiarity with HTML, JavaScript and Solidity, but you should be able to follow along even if you're coming from a different programming language. We'll also assume that you're familiar with programming concepts like functions, objects, arrays, and to a lesser extent, classes.

If you need to review JavaScript, we recommend reading [this guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Note that we're also using some features from ES6 -- a recent version of JavaScript. In this tutorial, we're using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), and [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) statements.

If you need to review Solidity, we recommend reading [this documention](https://solidity.readthedocs.io/en/v0.5.1/)

## Setup for the Tutorial

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/) installed.
2. Make sure you have a recent version of [Yarn](https://yarnpkg.com/lang/en/) installed.
3. Create a new project with create-react-app

```bash
npx create-react-app tutorial
cd tutorial
npx tutorial
```

</details>

### Help, I'm Stuck!

If you get stuck, please file an issue, and we'll help you out.

## Overview

Now that you're set up, let's get an overview of DApp Stack!

### Inspecting the Starter Code

You will see the following folder structure:

```bash
tutorial
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
│── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   └── serviceWorker.js
├── environments
│   ├── local.js
│   └── test.js
└── contracts
    ├── src
    |   └── SimpleStorage.sol
    └── tests
        └── SimpleStorageTest.js
```

DApp Stack has created for you the `environments` and `contracts` folder, the
rest comes from Create React App.

### Develop the Contract

The first things to do when you start to develop is to start DApp Stack, in order to so you can run:
```bash
yarn das start
```

You will now have a browser open at `http://localhost:3000` if everything went well.

You can now open the contracts `SimpleStorage.sol` located in `contracts/src/SimpleStorate.sol` and modified it as follow:

```sol
pragma solidity ^0.5.0;

contract SimpleStorage {

    string public ipfsHash;

    event Change(string message, string ipfsHash);

    function set(string memory _ipfsHash) public {
        emit Change("set", ipfsHash);
        ipfsHash = _ipfsHash;
    }

    function get() public view returns (string memory) {
        return ipfsHash;
    }

}
```

We change to `int`  variable to `string` and remove the required parameter.

The next step is to change your local environment and remove the parameter for the deployment
of the `SimpleStorage` contract.
It will look like that after:

```js
await deployer.deploy('SimpleStorage');
```

> Tip: You need to restart DApp Stack each time you modify the environment file.

Now that we have our contract deployed and working, let's interact with it.

### Metamask

In order to interact with your contract, you are going to need a way to connect to it with your browser.
We suggest that you use [Metamask](https://metamask.io).

> Tip: Be sure to save your mnemonic somewhere as you will need it for deployment.

Once you have installed and your account created you can now import the account from your local node.
For that, DApp Stack produce a log with the private key. It looks like that:

```bash
[Wallet] › ✔  success   Private key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Once imported in Metamask, you can now connect to the local node by selecting `localhost:8545` in the network selection.

You should also be able to see that you have ether, that means you will be able to interact with your contract.

> Note: This is a dev account, you don't have ether from the main network.

### Interact with Contract

In order to interact with out contract we are going to use DApp Stack redux packages.
You first need to install a few dependencies:

```bash
yarn add @dapp-stack/redux-eth @dapp-stack/redux-ipfs react-redux redux-observable
```

Once done, we now need to initialize our redux store, you can do it by replacing the code
in `src/index.js` by:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';

import ipfs from '@dapp-stack/redux-ipfs';
import eth from '@dapp-stack/redux-eth';

import * as serviceWorker from './serviceWorker';

import App from './App';

const rootEpic = combineEpics(
  ...ipfs.epics, ...eth.epics
);

const rootReducer = combineReducers({
  ipfs: ipfs.reducer,
  eth: eth.reducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
);

epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
);

serviceWorker.unregister();
```

Here, we are initializing our redux store. You can see that we are adding `ipfs` and `eth` to our root reducer and epics. Feel free to add your own if you need.

Also you can remove the css file: `src/index.css` as we don't use it.

Once done, you should see that your application still compile successfully.

We are all set with preparation and we can now develop our component. Open the `App` component in `src/App.js` and replace the code with:

```js
import React from 'react';
import eth from '@dapp-stack/redux-eth';
import ipfs from '@dapp-stack/redux-ipfs';
import { connect } from 'react-redux';
  
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: null, uploading: false, transaction: null, fileHash: '' };
  }

  componentDidMount() {
    this.props.ethStart();
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.network && this.props.network) {
      this.props.loadContracts(window.tracker[this.props.network.chainId]);
    }

    if (!this.state.file || this.state.fileHash || !this.props.files.length > 0) {
      return;
    }

    const file = this.props.files.find((f) => f.name === this.state.file.name)

    if (!file) {
      return;
    }

    this.setState({file: null});
    try {
      await window.ethereum.enable();
      const transaction = await this.props.contracts.SimpleStorage.set(file.hash);
      await transaction.wait();
      this.setState({ transaction });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <p>Network: {this.props.network && this.props.network.name}</p>
          <input type="file" onChange={this.setFile}/>
          {!this.state.uploading && <button onClick={this.uploadFile}>Upload</button>}
          {this.state.uploading && <span>Uploading...</span>}
        </div>
        <div>
          {this.state.transaction && 
            <p>Transaction Hash: {this.state.transaction.hash}</p>
          }
        </div>
        <div>
          <button onClick={this.getFileHash}>Get File Hash</button>

          <p>File Hash: {this.state.fileHash}</p>
        </div>
      </React.Fragment>
    );
  }

  setFile = (event) => {
    this.setState({ file: event.target.files[0] })
  }

  uploadFile = (event) => {
    event.preventDefault();

    if (!this.state.file) {
      return;
    }

    this.setState({uploading: true})
    const reader = new FileReader();
    reader.onload = () => {
      this.props.touch({ name: this.state.file.name, content: reader.result });
      this.setState({uploading: false});
    };
    reader.readAsArrayBuffer(this.state.file);
  }

  getFileHash = async (event) => {
    event.preventDefault();
    debugger
    const fileHash = await this.props.contracts.SimpleStorage.get();
    this.setState({ fileHash });
  }
}

function mapStateToProps(state) {
  return {
    contracts: state.eth.contracts,
    network: state.eth.provider.network,
    files: state.ipfs.files.list
  };
}

const App = connect(
  mapStateToProps,
  {
    ethStart: eth.actions.provider.start,
    loadContracts: eth.actions.contracts.load,
    touch: ipfs.actions.files.touch,
  }
)(AppComponent);

export default App;
```

Wow, this is a lot, let's try to explain what is happening here.

First of all in `componentDidMount` we initialize the connection to the ethereum node and fetch meta
about the node like the chainId and the gas price.

In `componentDidUpdate`, this is where all the magic is happening. There is two parts at this function:

* We load the contracts based on the node we are connected too.
* We update the contract with the ipfs hash

The rest is mainly react and redux usage as you would expect in any app.

Also you can remove the following files: `src/app.css` and `src/logo.svg` as we don't use them.

That's it, you should now be able to interact with your contract and ipfs. Notice that each time there is a change,
DApp Stack refresh everything for you.

### Run the tests

In order to run the tests, you can execute the following command:

```bash
yarn das test
```

You should see a couple of errors, this is normal as we modified the contract. You can modify the test as follow:

```js
const chai = require('chai');
const { setup } = require('@dapp-stack/test');

const { expect } = chai;

describe('SimpleStorage', () => {
  let simpleStorage;

  before(async () => {
    await setup(async deployer => {
      simpleStorage = await deployer.deploy('SimpleStorage');
    })
  });

  it('allow to change the value', async () => {
    await simpleStorage.set("hello");
    const value = await simpleStorage.get();
    if (!process.env.COVERAGE) {
      expect(value).to.eq("hello");
    }
  });
});
```

If you run them one more time, you should see that they run successfully this time.

In order to produce the code coverage, you can run the same command with COVERAGE at true:

```bash
COVERAGE=true yarn das test
```

You can find an html report at `contracts/coverage/index.html`

## Deploy It

We now have our application fully ready to be deployed. We are going to deploy our application to the **ropsten** network

### Preparation

The first things to do is to get ether into your account. From metamask, select the ropsten network and copy your public address.
Then you can go to [http://faucet.ropsten.be/](http://faucet.ropsten.be/) and request ether.
After a few minute you should see that you 1 ether in your account.

### Publish Smart Contract and Assets

We will create a dedicated environment file for Ropsten network, we can call this file:
`environments/ropsten.js` and to start, we can copy the content of `local.js`.

You can uncomment this line: `const decryptedSecrets = secrets.decrypt();`
Set the network to be ropsten: `network: 'ropsten',`
Finally change the mnemonic to: `mnemonic: decryptedSecrets.ropsten.mnemonic,`

In order to safely store our secrets, we will the `secrets` package.
You first need to initialize it by running:

```bash
  yarn secrets setup
```

> WARNING: Never commit the `master.key` file

Now we can add the mnemonic into the encrypted file by doing:

```bash
yarn secrets edit
```

It will open your editor and save the file when the editor is closed.

It needs to look like that:


```json
{
  "ropsten": {
    "mnemonic": "your mnemonic here"
  }
}
```

If you run:
```bash
yarn secrets show
```

You should see exactly what you typed.

Before runnning the deploy command you need to update the `package.json` with the following snippet:

```js
"homepage": "./",
```

This is specific to create-react-app so that downloading assets will works.

The last step to publish your dapp is to run:

```bash
export DAPP_ENV=ropsten && yarn das deploy
```

### Wrapping Up

Congratulations! You've created and deployed a simple DApp

Nice work! We hope you now feel like you have a decent grasp on how DApp Stack works.

Check out the final result here: **[Final Result](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/apps/tutorial)**.

Throughout this tutorial, we touched on DApp Stack concepts including development, testing and deployment. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/getting-started.html).
