import Web3 from "web3";
import { createSaga } from "../contracts/index";

import { CONTRACT_NAME } from "./constants";
import abi from "./abi";

export default (provider, options = {}) => {
  Web3.Eth.Contract.setProvider(provider);
  const contract = new Web3.Eth.Contract(abi, options.at);
  return createSaga(CONTRACT_NAME, contract);
};