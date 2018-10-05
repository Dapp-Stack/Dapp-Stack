import { StateType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import config from './init';
import files from './accounts';

export const web3Reducer = combineReducers({
  config,
  files
});

export type Web3State = StateType<typeof web3Reducer>;