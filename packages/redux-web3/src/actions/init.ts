import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import Web3 = require('web3');

export const request = {
  connect: createAsyncAction('WEB3/CONNECT/REQUEST', 'WEB3/CONNECT/SUCCESS', 'WEB3/CONNECT/FAILURE')<
    void,
    Web3,
    Error
  >(),
};

export const start = createStandardAction('WEB3/START')<void>();