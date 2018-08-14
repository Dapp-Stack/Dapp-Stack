import { call, put, takeEvery, select } from "redux-saga/effects";

import ACCOUNTS from "./types";
import actions from "./actions";

export const getAccounts = function*() {
  const web3 = yield select((state) => state.web3.instance);

  try {
    const payload = yield call(web3.eth.getAccounts);
    yield put(actions.getAccountsSuccess(payload));
  } catch (error) {
    yield put(actions.getAccountsFailure(error));
  }
};

export function* accountsSaga() {
  yield takeEvery(ACCOUNTS.GET_REQUEST, getAccounts);
}
