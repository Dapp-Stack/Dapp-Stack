import { getType } from 'typesafe-actions'
import { contracts, ContractsAction } from '../actions'
import { ContractsState } from '../types'

export default (state: ContractsState = {}, action: ContractsAction) => {
  switch (action.type) {
    case getType(contracts.request.contracts.success):
      return action.payload
    default:
      return state
  }
}
