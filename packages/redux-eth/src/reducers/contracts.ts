import { getType } from 'typesafe-actions';
import * as ethers from 'ethers';
import { contracts, ContractsAction } from '../actions';

type ContractsState = ethers.Contract[];

export default (state: ContractsState = [], action: ContractsAction) => {
  switch (action.type) {
    case getType(contracts.request.contracts.success):
      return action.payload;
    default:
      return state;
  }
};
