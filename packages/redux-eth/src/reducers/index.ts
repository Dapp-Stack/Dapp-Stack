import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';

import accounts from './accounts';
import init from './init';

export const web3Reducer = combineReducers({
  config,
  files,
});

export type Web3State = StateType<typeof web3Reducer>;
