import Web3 from "web3";
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
} from "redux";
import {all, fork} from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import {connectRouter, routerMiddleware} from 'connected-react-router';

import reducers from "./reducers";
import sagas from "./sagas";
import history from "../history";

const sagaMiddleware = createSagaMiddleware({
  context: {
    web3: new Web3(),
  },
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware));

function* root() {
  yield all([...Object.values(sagas).map(saga => fork(saga))]);
}

export default function createStore(initialState = {}) {
  const store = createReduxStore(connectRouter(history)(reducers), initialState, middleware);
  store.sagaTask = sagaMiddleware.run(root);
  return store;
}
