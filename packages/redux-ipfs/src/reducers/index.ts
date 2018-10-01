import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import config from './config';
import files from './files';

export const ipfsReducer = combineReducers({
  config,
  files
});


export type IpfsState = StateType<typeof ipfsReducer>;