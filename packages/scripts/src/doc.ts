#!/usr/bin/env node

const { generateDoc } = require('../lib/generateDoc');
const { contracts } = require('../config');

const docAll = function() {
  return contracts.map(contractName => generateDoc(contractName));
};

docAll();
