import * as types from './types'


const initialState = {
  isLoading: false,
  isConnected: false,
  networkId: null,
  instance: null,
  error: null
}

const web3Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.WEB3.INIT_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.WEB3.INIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        instance: payload,
        isConnected: true,
        error: null
      };
    case types.WEB3.INIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isConnected: false,
        error: payload
      };
    case types.WEB3.NETWORK_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.WEB3.NETWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        networkId: payload,
        error: null
      };
    case types.WEB3.NETWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        networkId: null,
        error: payload
      };
    default:
      return state
  }
}

export default web3Reducer;
