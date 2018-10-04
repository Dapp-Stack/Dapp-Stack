import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, compose } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { epics as ipfsEpics, reducers as ipfsReducers } from '@solon/redux-ipfs';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import history from './history';
import AppContainer from './containers/AppContainer';

import 'semantic-ui-css/semantic.min.css';

const rootEpic = combineEpics(
  ...ipfsEpics
);

const rootReducer = combineReducers({
  ipfs: ipfsReducers
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();
const store = createStore(
  connectRouter(history)(rootReducer), 
  composeEnhancers(
    applyMiddleware(routerMiddleware(history), epicMiddleware)
  )
);

epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);
