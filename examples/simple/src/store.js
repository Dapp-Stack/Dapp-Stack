import { combineReducers } from 'redux';
import { reducer as explorerReducer } from './features/Explorer';

export default combineReducers({
  explorerReducer,
});
