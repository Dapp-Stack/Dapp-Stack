import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import * as ethers from 'ethers';

export const request = {
  connect: createAsyncAction('ETH/CONNECT/REQUEST', 'ETH/CONNECT/SUCCESS', 'ETH/CONNECT/FAILURE')<
    void,
    ethers.providers.Web3Provider,
    Error
  >(),
  gasPrice: createAsyncAction('ETH/GAS_PRICE/REQUEST', 'ETH/GAS_PRICE/SUCCESS', 'ETH/GAS_PRICE/FAILURE')<
    void,
    ethers.ethers.utils.BigNumber,
    Error
  >(),
  network: createAsyncAction('ETH/NETWORK/REQUEST', 'ETH/NETWORK/SUCCESS', 'ETH/NETWORK/FAILURE')<
    void,
    ethers.ethers.utils.Network,
    Error
  >(),
};

export const start = createStandardAction('ETH/START')<void>();
