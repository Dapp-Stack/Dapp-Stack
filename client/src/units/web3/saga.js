import * as actions from './actions';
import * as types from './types';
import Web3 from "web3";

import { eventChannel } from 'redux-saga';
import { put, takeEvery, call, take, select, all } from 'redux-saga/effects'

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
  yield put(actions.initWeb3Success(web3));
  if (web3.currentProvider.isMetaMask) {
    return;
  }
  const channel = yield call(createChannel, provider);
  while(true) {
    yield take(channel);
    yield put(actions.initWeb3Failure("Connection interrupted"));
  }
}

export function *networkRequest() {
  try {
    let web3 = yield select((state) => state.web3.instance);
    const networkId = yield call(web3.eth.net.getId);
    yield put(actions.networkSuccess(networkId));
  } catch(error) {
    yield put(actions.networkFailure(error));
  }

}

export function *web3Saga() {
  yield all([
    yield takeEvery(types.WEB3.INIT_REQUEST, initWeb3),
    yield takeEvery(types.WEB3.NETWORK_REQUEST, networkRequest)
  ]);

}
