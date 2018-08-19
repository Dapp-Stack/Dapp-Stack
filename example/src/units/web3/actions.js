import * as types from './types'

export const initWeb3Request = rpcAddr => ({
  type: types.WEB3.INIT_REQUEST,
  payload: rpcAddr
});

export const initWeb3Success = web3 => ({
  type: types.WEB3.INIT_SUCCESS,
  payload: web3
});

export const initWeb3Failure = err => ({
  type: types.WEB3.INIT_FAILURE,
  payload: err
});

export const networkRequest = () => ({
  type: types.WEB3.NETWORK_REQUEST
});

export const networkSuccess = (id) => ({
  type: types.WEB3.NETWORD_SUCCESS,
  payload: id
});

export const networkFailure = (err) => ({
  type: types.WEB3.NETWORD_FAILURE,
  payload: err
});
