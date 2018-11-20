import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';

import ipfs from '@dapp-stack/redux-ipfs';
import eth from '@dapp-stack/redux-eth';

import { trackerReducer } from './modules/Tracker'
import trackerEpics from './modules/Tracker/epics'

import './styles/index.scss';
import './styles/flexboxgrid.scss';
import './font-files/inter-ui.css';
import './styles/Toastify.scss';
import history from './history';
import * as serviceWorker from './serviceWorker';

import App from './layout/App';

const rootEpic = combineEpics(
  ...ipfs.epics, ...eth.epics, ...trackerEpics
);

const rootReducer = combineReducers({
  router: connectRouter(history),
  ipfs: ipfs.reducer,
  eth: eth.reducer,
  tracker: trackerReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware();
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(routerMiddleware(history), epicMiddleware)
  )
);

epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();


