import {
  createMethodCall,
  createMethodSend
} from "../contracts";
import {
  CONTRACT_NAME
} from "./constants";


export function name(options = {}) {
  return createMethodCall(CONTRACT_NAME, "name", options)();
}

export function symbol(options = {}) {
  return createMethodCall(CONTRACT_NAME, "symbol", options)();
}

export function totalSupply(who, options = {}) {
  return createMethodCall(CONTRACT_NAME, "totalSupply", options)(who);
}

export function balanceOf(owner, options = {}) {
  return createMethodCall(CONTRACT_NAME, "balanceOf", options)(owner);
}

export function allowance(owner, spender, options = {}) {
  return createMethodCall(CONTRACT_NAME, "allowance", options)(owner, spender);
}

export function transfer(to, tokens, options = {}) {
  return createMethodSend(CONTRACT_NAME, "transfer", options)(to, tokens);
}

export function approve(spender, tokens, options = {}) {
  return createMethodSend(CONTRACT_NAME, "approve", options)(spender, tokens);
}

export function transferFrom(from, to, tokens, options = {}) {
  return createMethodSend(CONTRACT_NAME, "transferFrom", options)(from, to, tokens);
}
