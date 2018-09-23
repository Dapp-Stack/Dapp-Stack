import {config as actions} from '../actions'

const configDefaultState = {
  config: {}
}

export default function config (state = configDefaultState, action) {
  switch (action.type) {
    case actions.requests.CONFIG_LOAD.SUCCESS:
      return {
        ...state,
        config: action.response
      }
    default:
      return state
  }
}