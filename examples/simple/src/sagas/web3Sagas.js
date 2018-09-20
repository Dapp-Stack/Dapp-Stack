import { delay } from 'redux-saga';
import { put, all } from 'redux-saga/effects';

import { actionTypes } from './web3Actions';

function* testSaga() {
  yield delay(1000);
  yield put({ type: actionTypes.FOO });
}

export default function* rootSaga() {
  yield all([testSaga()]);
}
