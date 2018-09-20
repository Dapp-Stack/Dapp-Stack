import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import 'semantic-ui-css/semantic.min.css';

import AppContainer from './containers/AppContainer';
import { rootEpic } from './epics';

const history = createBrowserHistory();

import reducers from './store';

const epicMiddleware = createEpicMiddleware();

epicMiddleware.run(rootEpic);

const store = createStore(reducers, applyMiddleware(epicMiddleware));

// index.js

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);
