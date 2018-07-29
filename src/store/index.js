import { createStore, combineReducers } from 'redux';
import reducers from '../reducers/reducers';

export const store = createStore(
  combineReducers({
    state: reducers
  }),
  window.__REDUX_DEVTOOL_EXTENSION__ && window.__REDUX_DEVTOOL_EXTENSION__()
)
