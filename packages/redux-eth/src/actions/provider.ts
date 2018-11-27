import { createAsyncAction, createStandardAction } from 'typesafe-actions'
import * as ethers from 'ethers'

export const request = {
  connect: createAsyncAction(
    'ETH/CONNECT/REQUEST',
    'ETH/CONNECT/SUCCESS',
    'ETH/CONNECT/FAILURE'
  )<void, ethers.providers.Web3Provider, Error>(),
  gasPrice: createAsyncAction(
    'ETH/GAS_PRICE/REQUEST',
    'ETH/GAS_PRICE/SUCCESS',
    'ETH/GAS_PRICE/FAILURE'
  )<void, ethers.ethers.utils.BigNumber, Error>(),
  network: createAsyncAction(
    'ETH/NETWORK/REQUEST',
    'ETH/NETWORK/SUCCESS',
    'ETH/NETWORK/FAILURE'
  )<void, ethers.ethers.utils.Network, Error>(),
  address: createAsyncAction(
    'ETH/ADDRESS/REQUEST',
    'ETH/ADDRESS/SUCCESS',
    'ETH/ADDRESS/FAILURE'
  )<void, string, Error>(),
  balance: createAsyncAction(
    'ETH/BALANCE/REQUEST',
    'ETH/BALANCE/SUCCESS',
    'ETH/BALANCE/FAILURE'
  )<void, ethers.ethers.utils.BigNumber, Error>(),
  blockNumber: createAsyncAction(
    'ETH/BLOCK_NUMBER/REQUEST',
    'ETH/BLOCK_NUMBER/SUCCESS',
    'ETH/BLOCK_NUMBER/FAILURE'
  )<void, number, Error>(),
  transactionCount: createAsyncAction(
    'ETH/TRANSACTION_COUNT/REQUEST',
    'ETH/TRANSACTION_COUNT/SUCCESS',
    'ETH/TRANSACTION_COUNT/FAILURE'
  )<void, number, Error>(),
  block: createAsyncAction(
    'ETH/BLOCK/REQUEST',
    'ETH/BLOCK/SUCCESS',
    'ETH/BLOCK/FAILURE'
  )<number, ethers.providers.Block, Error>(),
  transaction: createAsyncAction(
    'ETH/TRANSACTION/REQUEST',
    'ETH/TRANSACTION/SUCCESS',
    'ETH/TRANSACTION/FAILURE'
  )<string, ethers.providers.TransactionResponse, Error>()
}

export const findBlock = createStandardAction('ETH/FIND_BLOCK')<number>()
export const findTransaction = createStandardAction('ETH/FIND_TRANSACTION')<
  string
>()
export const start = createStandardAction('ETH/START')<void>()
