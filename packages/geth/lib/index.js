"use strict";

const compose = require('docker-compose');

const startGeth = function(options = {}) {
  compose.up({ cwd: path.join(__dirname, '../') });
};

const stopGeth = function(options = {}) {
  compose.down({ cwd: path.join(__dirname, '../') })
};

module.exports = {
  startGeth,
  stopGeth
};
