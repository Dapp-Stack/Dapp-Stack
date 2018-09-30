import { put, call, select, fork, take, race, all } from 'redux-saga/effects';

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

export function* load() {
  yield all([
    fork(actions.ls, ls),
    // fork(files.cwd, cwd),
    // fork(files.cat, cat),
    // fork(files.mkdir, mkdir),
    // fork(files.rmdir, rmdir),
    // fork(files.rm, rm),
    // fork(files.touch, touch),
  ]);
}