import { combineReducers } from "redux";
import web3Reduce from "./web3/reducer";
import accountReducer from "./accounts/reducer";

export default combineReducers({web3Reduce, accountReducer});
