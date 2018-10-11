import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import * as ethers from 'ethers';
import { BuildContractsInput } from '../types';

export const request = {
  contracts: createAsyncAction('ETH/CONTRACTS/REQUEST', 'ETH/CONTRACTS/SUCCESS', 'ETH/CONTRACTS/FAILURE')<
    BuildContractsInput,
    ethers.Contract[],
    Error
  >(),
};

export const contracts = createStandardAction('ETH/CONTRACTS')<BuildContractsInput>();
