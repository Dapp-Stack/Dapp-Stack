import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import contract from 'web3/eth/contract';

export const request = {
  contracts: createAsyncAction('WEB3/CONTRACTS/REQUEST', 'WEB3/CONTRACTS/SUCCESS', 'WEB3/CONTRACTS/FAILURE')<
    void,
    Contract[],
    Error
(),
};

export const contracts = createStandardAction('WEB3/CONTRACTS')<void>();
