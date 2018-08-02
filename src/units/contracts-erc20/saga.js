import Web3 from "web3";
import { createSaga } from "../contracts";

import abi from "./abi";

export default (provider, options = {}) => {
  Web3.Eth.Contract.setProvider(provider);
  const contract = new Web3EthContract(abi, options.at);
  return createSaga("ERC20", contract);
};
