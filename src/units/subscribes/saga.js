import { call, getContext, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import Web3 from "web3";

import { createTypes } from "./types";

function createChannel(eth, subscriptionName, types, options) {
  const subscription = eth.subscribe(subscriptionName, () => {});
  return eventChannel(emit => {
    subscription.on("data", data => {
      emit({
        type: types.DATA,
        payload: data,
      });
    });
    subscription.on("error", data => {
      emit({
        type: types.ERROR,
        payload: data,
      });
      emit(END);
    });

    return subscription.unsubscribe;
  });
}

function* watchChannel(subscriptionName, types, { options }) {
  const { provider } = options;

  let channel;

  if (provider) {
    const eth = new Web3(provider).eth;
    channel = createChannel(eth, subscriptionName, types, options);
  } else {
    const web3 = yield getContext("web3");
    channel = createChannel(web3.eth, subscriptionName, types, options);
  }

  try {
    while (true) {
      var event = yield take(channel);
      yield put(event);
    }
  } finally {
    channel.close();
  }
}

export function create(name, subscriptionName) {
  const types = createTypes(name, subscriptionName);

  return function* saga() {
    yield takeEvery(types.SUBSCRIBE, function*({ type, payload }) {
      yield call(watchChannel, subscriptionName, types, payload);
    });
  };
}
