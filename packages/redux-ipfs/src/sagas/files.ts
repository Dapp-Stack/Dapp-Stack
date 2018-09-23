import {put, call, select, fork, take, race} from 'redux-saga/effects'
import {join} from 'path'

import {files as actions} from '../actions'
import api from '../services/api'

export function * fetchFiles () {
  yield put(actions.requests.list.request())

  try {
    const {files} = yield select()
    const res = yield call(api.files.list, files.root)
    yield put(actions.requests.list.success(res))
  } catch (err) {
    yield put(actions.requests.list.failure(err.message))
  }
}

function delay (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function * watchFiles () {
  let cancel
  yield call(fetchFiles)

  while (!cancel) {
    ({cancel} = yield race({
      delay: call(delay, 10000),
      cancel: take(actions.FILES.LEAVE)
    }))

    if (!cancel) {
      yield call(fetchFiles)
    }
  }

  yield put(actions.cancel())
}

export function * watchFilesRoot () {
  while (yield take(actions.FILES.SET_ROOT)) {
    yield fork(fetchFiles)
  }
}

export function * watchCreateDir () {
  while (yield take(actions.FILES.CREATE_DIR)) {
    try {
      yield put(actions.requests.mkdir.request())
      const {files} = yield select()
      const name = join(files.tmpDir.root, files.tmpDir.name)
      yield call(api.files.mkdir, name)

      yield fork(fetchFiles)
      yield put(actions.requests.mkdir.success())
      yield put(files.rmTmpDir())
    } catch (err) {
      yield put(actions.requests.mkdir.failure(err.message))
    }
  }
}

export function * watchCreateFiles () {
  while (true) {
    try {
      const {root, files} = yield take(actions.FILES.CREATE_FILES)
      yield put(actions.requests.createFiles.request())
      yield call(api.files.createFiles, root, files)

      yield fork(fetchFiles)
      yield put(actions.requests.createFiles.success())
    } catch (err) {
      yield put(actions.requests.createFiles.failure(err.message))
    }
  }
}

export function * watchRmDir () {
  while (yield take(actions.FILES.REMOVE_DIR)) {
    try {
      yield put(actions.requests.rmDir.request())
      const {files} = yield select()

      for (let file of files.selected) {
        yield call(api.files.rmdir, file)
      }

      yield fork(fetchFiles)
      yield put(actions.requests.rmDir.success())
      yield put(actions.deselectAll())
    } catch (err) {
      yield put(actions.requests.rmDir.failure(err.message))
    }
  }
}

export function * load () {
  yield fork(watchFiles)
  yield fork(watchFilesRoot)
  yield fork(watchCreateDir)
  yield fork(watchRmDir)
  yield fork(watchCreateFiles)
}