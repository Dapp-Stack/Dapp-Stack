import {call, put} from 'redux-saga/effects'

import api from '../services/api'
import {config as actions} from '../actions'

export function * loadConfig () {
  try {
    yield put(actions.requests.load.request())

    const ipfsConfig = yield call(api.getConfig)

    yield put(actions.requests.load.success(ipfsConfig))
  } catch (err) {
    yield put(actions.requests.load.failure(err.message))
  }
}