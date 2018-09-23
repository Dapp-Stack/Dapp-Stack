import { put, call, select, fork, take } from 'redux-saga/effects';

import { preview as actions } from '../actions';
import * as api from '../services/api';
import { loadConfig } from './config';

export function* stat() {
  try {
    yield put(actions.requests.stat.request());

    const { routing } = yield select();
    const { name } = routing.locationBeforeTransitions.query;
    const stats = yield call(api.files.stat, name);

    yield put(
      actions.requests.stat.success({
        name,
        stats,
      }),
    );
  } catch (err) {
    yield put(actions.requests.stat.failure(err.message));
  }
}

export function* read(name: string) {
  try {
    yield put(actions.requests.read.request());

    const content = yield call(api.files.read, name);

    yield put(actions.requests.read.success(content));
  } catch (err) {
    yield put(actions.requests.read.failure(err.message));
  }
}

export function* watchRead() {
  const { name } = yield take(actions.PREVIEW.READ);

  yield fork(read, name);
}

export function* load() {
  yield fork(stat);
  yield fork(loadConfig);
  yield fork(watchRead);
}

export function* leave() {
  yield put(actions.clear());
}
