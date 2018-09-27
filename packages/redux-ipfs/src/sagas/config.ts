import { call, put, fork } from 'redux-saga/effects';

import * as api from '../services/api';
import { config } from '../actions';

export function* loadConfig() {
  try {
    yield put(config.load.request());

    const ipfsConfig = yield call(api.getConfig);

    yield put(config.load.success(ipfsConfig));
  } catch (error) {
    yield config.load.failure(error);
  }
}

export function* load() {
  yield fork(loadConfig);
}