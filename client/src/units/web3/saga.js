import * as actions from './actions';
import * as types from './types';
import Web3 from "web3";

import { eventChannel } from 'redux-saga';
import { put, takeEvery, call, take } from 'redux-saga/effects'

function createChannel(provider) {
  return eventChannel(emit => {
    provider.on("error", (e) => emit(e));
    provider.on("close", (e) => emit(e));
    return () => {};
  });
}

export function *initWeb3({payload}){
  const web3 = new Web3(payload.provider);
  const provider = web3.currentProvider;
  const channel = yield call(createChannel, provider);
  yield put(actions.initWeb3Success(web3));
  while(true) {
    yield take(channel);
    yield put(actions.initWeb3Failure("Connection interrupted"));
  }
}

export function *web3Saga() {
  yield takeEvery(types.WEB3.INIT_REQUEST, initWeb3);
}
