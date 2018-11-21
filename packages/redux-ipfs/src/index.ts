import * as actions from './actions'
import epics from './epics'
import { ipfsReducer } from './reducers'

export { File } from './types'
export default { reducer: ipfsReducer, epics, actions }
