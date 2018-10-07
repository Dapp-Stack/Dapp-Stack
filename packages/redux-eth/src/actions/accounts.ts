import { createAsyncAction, createStandardAction } from 'typesafe-actions';

export const request = {
  accounts: createAsyncAction('WEB3/ACCOUNTS/REQUEST', 'WEB3/ACCOUNTS/SUCCESS', 'WEB3/ACCOUNTS/FAILURE')<
    void,
    string[],
    Error
(),

  setDefaultAccount: createAsyncAction(
    'WEB3/SET_DEFAULT_ACCOUNT/REQUEST',
    'WEB3/SET_DEFAULT_ACCOUNT/SUCCESS',
    'WEB3/SET_DEFAULT_ACCOUNT/FAILURE',
  )<string, void, Error>(),
  transactionCount: createAsyncAction(
    'WEB3/TRANSACTION_COUNT/REQUEST',
    'WEB3/TRANSACTION_COUNT/SUCCESS',
    'WEB3/TRANSACTION_COUNT/FAILURE',
  )<string, number, Error>(),
  balance: createAsyncAction('WEB3/BALANCE/REQUEST', 'WEB3/BALANCE/SUCCESS', 'WEB3/BALANCE/FAILURE')<
    string,
    number,
    Error
(),
};

export const accounts = createStandardAction('WEB3/ACCOUNTS')<string>();
export const setDefaultAccount = createStandardAction('WEB3/SET_DEFAULT_ACCOUNT')<string>();
