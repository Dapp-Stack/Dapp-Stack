import { call, put, fork, all } from 'redux-saga/effects';

import * as api from '../services/api';
import { config } from '../actions';

export function* loadConfig() {
  try {
    yield put(config.request.load.request());

    const ipfsConfig = yield call(api.getConfig);

    yield put(config.request.load.success(ipfsConfig));
  } catch (error) {
    yield config.request.load.failure(error);
  }
}

export function* load() {
  yield all([
    fork(config.init, loadConfig),
  ]);
}
