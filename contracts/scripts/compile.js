#!/usr/bin/env node

const { compile } = require("../lib/compiler");
const { contracts } = require("../config");

const compileAll = function() {
  contracts.map((contractName) => {
    compile(contractName);
  });
};

compileAll();
