import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import web3 = require('web3');

export const request = {
  connect: createAsyncAction('WEB3/CONNECT/REQUEST', 'WEB3/CONNECT/SUCCESS', 'WEB3/CONNECT/FAILURE')<
    void,
    Web3,
    Error
(),
  gasPrice: createAsyncAction('WEB3/GAS_PRICE/REQUEST', 'WEB3/GAS_PRICE/SUCCESS', 'WEB3/GAS_PRICE/FAILURE')<
    void,
    number,
    Error
(),
  network: createAsyncAction('WEB3/NETWORK/REQUEST', 'WEB3/NETWORK/SUCCESS', 'WEB3/NETWORK/FAILURE')<
    void,
    number,
    Error
(),
};

export const start = createStandardAction('WEB3/START')<void>();
