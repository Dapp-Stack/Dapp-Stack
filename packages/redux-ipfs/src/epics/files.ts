import { put, call, select, fork, take, race, all, takeEvery } from 'redux-saga/effects';

import { files as actions } from '../actions';
import * as api from '../services/api';
import { File } from '../types';

export function* ls() {
  yield put(actions.request.ls.request());

  try {
    const state = yield select();
    const files: File[] = yield call(api.files.ls, state.files.root);
    yield put(actions.request.ls.success(files));
  } catch (err) {
    yield put(actions.request.ls.failure(err.message));
  }
}

export function* cat(payload) {
  yield put(actions.request.cat.request());

  try {
    const content: string = yield call(api.files.cat, path);
    yield put(actions.request.cat.success(content));
  } catch (err) {
    yield put(actions.request.cat.failure(err.message));
  }
}

export function* load() {
  yield all([
    yield takeEvery(actions.ls, ls),
    yield takeEvery(actions.cat, cat),
    // fork(files.mkdir, mkdir),
    // fork(files.rmdir, rmdir),
    // fork(files.rm, rm),
    // fork(files.touch, touch),
  ]);
}