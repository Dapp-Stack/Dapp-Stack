import { fork } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';

import * as actions from '../actions';
export default function*() {
  yield Object.keys(actions).reduce((acc, name) => {
    const action = actions[name];

    if (action.mount) {
      acc.push(
        fork(function*() {
          yield* takeLatest(action[name.toUpperCase()].MOUNT, action.mount);
        }),
      );
    }

    if (action.unmount) {
      acc.push(
        fork(function*() {
          yield* takeLatest(action[name.toUpperCase()].UNMOUNT, action.unmount);
        }),
      );
    }

    return acc;
  }, []);
}
