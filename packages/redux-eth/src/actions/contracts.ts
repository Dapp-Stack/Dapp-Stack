import { createAsyncAction, createStandardAction } from 'typesafe-actions'
import * as ethers from 'ethers'
import { BuildContractsInput, ContractsState } from '../types'

export const request = {
  contracts: createAsyncAction(
    'ETH/CONTRACTS/REQUEST',
    'ETH/CONTRACTS/SUCCESS',
    'ETH/CONTRACTS/FAILURE'
  )<BuildContractsInput, ContractsState, Error>()
}

export const load = createStandardAction('ETH/CONTRACTS')<BuildContractsInput>()
