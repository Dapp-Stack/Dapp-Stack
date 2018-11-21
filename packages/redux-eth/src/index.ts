import * as actions from './actions'
import epics from './epics'
import { ethReducer } from './reducers'

export { Contract } from 'ethers'
export { Network, EventFragment, FunctionFragment } from 'ethers/utils'
export { ContractsState, BuildContractsInput } from './types'
export default { reducer: ethReducer, epics, actions }
