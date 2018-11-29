# `@dapp-stack/redux-eth`

Redux wrapper around Ethereum.
We use [ethers.js](https://github.com/ethers-io/ethers.js/)

## Installation

```sh
# Yarn
yarn add @dapp-stack/redux-eth

# NPM
npm install @dapp-stack/redux-ieth
```

## Initialize with react

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import * as eth from "@dapp-stack/redux-eth";

const rootEpic = combineEpics(
  ...eth.epics
);

const rootReducer = combineReducers({
  eth: eth.reducer
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
    <YourComponent />
  </Provider>, 
  document.getElementById('root')
);
```

## State

Structure of the state;

```js
type ProviderState = {
  instance?: ethers.providers.Web3Provider;
  network?: ethers.utils.Network;
  string?: number;
  address?: string;
  transactionCount?: number;
  blockNumber?: number;
  blocks: ethers.providers.Block[];
  transactions: ethers.providers.TransactionResponse[];
  errors: {
    [event: string]: Error | null;
  };
  loading: {
    [event: string]: boolean;
  };
}

type ContractsState = { [name: string]: ethers.Contract }

type State = {
  contracts: ContractsState;
  provider: ProviderState;
}
```

## Actions

Actions name follow UNIX style:

* `provider.start`: Initialize metadata from the network
* `provider.findTransaction`: Find a transaction by hash
* `provider.findBlock`: Find a block by number
* `contracts.load`: Load the contracts, takes the tracker as parameter

You can use them with redux as follow:

```js
connect(
  mapStateToProps,
  {
    start: ipfs.actions.provider.start,
  },
)(YourComponent);
```

You can also see a detailed usage of the package in our [dev-tools](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/apps/dev-tools)
