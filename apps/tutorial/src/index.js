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


