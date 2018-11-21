import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'

import contracts from './contracts'
import provider from './provider'

export const ethReducer = combineReducers({
  contracts,
  provider
})

export type EthState = StateType<{ eth: typeof ethReducer }>
