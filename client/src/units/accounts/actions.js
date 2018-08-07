import types from "./types";

const getAccountsRequest = function(){
  return { type: types.GET_REQUEST }
}

const getAccountsFailure = function(error){
  return {
    type: types.GET_FAILURE,
    payload: error,
    error: true,
  }
}

const getAccountsSuccess = function(accounts){
  return {
    type: types.GET_SUCCESS,
    payload: accounts,
  }
}

export default {
  getAccountsRequest,
  getAccountsFailure,
  getAccountsSuccess
};
