# `@dapp-stack/redux-ipfs`

Redux wrapper around IPFS.

## Installation

```sh
# Yarn
yarn add @dapp-stack/redux-ipfs

# NPM
npm install @dapp-stack/redux-ipfs
```

## Initialize with react

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import * as ipfs from "@dapp-stack/redux-ipfs";

const rootEpic = combineEpics(
  ...ipfs.epics
);

const rootReducer = combineReducers({
  ipfs: ipfs.reducer
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
enum FileType {
  File,
  Directory
}

type File = {
  name: string;
  size: number;
  hash: string;
  type: FileType;
}

type State = {
  root: string;
  list: File[];
  content: string;
  error: Error | null;
}
```

Default state:

```js
const defaultState: State = {
  list: [],
  root: '/',
  content: '',
  error: null
}
```

## Actions

Actions name follow UNIX style:

* `cwd`: Change directory
* `ls`: List files
* `rm`: Remove file
* `cat`: Return the content of file
* `touch`: Create a file
* `mkdir`: Create a folder
* `rmdir`: Remove a folder

You can use them with redux as follow:

```js
connect(
  mapStateToProps,
  {
    ls: ipfs.actions.files.ls,
  },
)(YourComponent);
```

You can also see a detailed usage of the package in our [dev-tools](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/apps/dev-tools)
