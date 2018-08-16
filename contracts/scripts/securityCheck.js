#!/usr/bin/env node

const { securityCheck } = require("../lib/securityChecker");
const { contracts } = require("../config");

const securityCheckAll = function() {
  return contracts.map((contractName) => securityCheck(contractName));
};

securityCheckAll();
