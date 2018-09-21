import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import history from './history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import 'semantic-ui-css/semantic.min.css';

import AppContainer from './containers/AppContainer';
import { rootSaga } from './sagas';
import reducers from './store';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(connectRouter(history)(reducers), applyMiddleware(routerMiddleware(history), sagaMiddleware));

sagaMiddleware.run(rootSaga);

// index.js

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'),
);
