#!/usr/bin/env node

const { securityCheck: security } = require("../lib/securityChecker");
const { contracts } = require("../config");

const securityCheckAll = function() {
  return contracts.map((contractName) => security(contractName));
};

securityCheckAll();
