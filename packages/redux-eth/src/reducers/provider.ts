import { getType } from 'typesafe-actions';
import * as ethers from 'ethers';
import { provider, ProviderAction } from '../actions';

type ProviderState = {
  provider?: ethers.providers.Web3Provider;
  network?: ethers.utils.Network;
  gasPrice?: ethers.utils.BigNumber;
}

export default (state: ProviderState = {}, action: ProviderAction) => {
  switch (action.type) {
    case getType(provider.request.connect.success):
      return {
        ...state,
        provider: action.payload,
      };
    case getType(provider.request.network.success):
      return {
        ...state,
        network: action.payload,
      };
    case getType(provider.request.gasPrice.success):
      return {
        ...state,
        gasPrice: action.payload
      };
    default:
      return state;
  }
};
