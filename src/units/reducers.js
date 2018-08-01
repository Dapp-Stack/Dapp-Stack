import { combineReducers } from "redux";
import accounts from "./accounts/reducer";
import blocks from "./blocks/reducer";

export default combineReducers({accounts, blocks});
