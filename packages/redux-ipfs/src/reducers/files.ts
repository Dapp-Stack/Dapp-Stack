import { includes, reject, union } from 'lodash'
import { getType } from 'typesafe-actions'

import { files, FilesAction } from '../actions'
import { File } from '../types'

type State = {
  root: string
  list: File[]
  content: string
  error: Error | null
}

const defaultState: State = {
  list: [],
  root: '/',
  content: '',
  error: null
}

export default function(state: State = defaultState, action: FilesAction) {
  switch (action.type) {
    case getType(files.cwd):
      return {
        ...state,
        ...{ root: action.payload }
      }
    case getType(files.request.ls.success):
      return {
        ...state,
        ...{ list: action.payload, error: null }
      }
    case getType(files.request.ls.failure):
      return {
        ...state,
        ...{ list: [], error: action.payload }
      }
    case getType(files.request.cat.success):
      return {
        ...state,
        ...{ content: action.payload }
      }
    default:
      return state
  }
}
