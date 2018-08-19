import { combineReducers } from "redux";
import web3Reduce from "./web3/reducer";
import accountsReducer from "./accounts/reducer";

export default combineReducers({web3: web3Reduce, accounts: accountsReducer});
