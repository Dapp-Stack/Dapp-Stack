import { StateType } from 'typesafe-actions'
import { combineReducers } from 'redux'

import files from './files'

export const ipfsReducer = combineReducers({ files })
export type IpfsState = StateType<{ ipfs: typeof ipfsReducer }>
