"use strict";

const compose = require('docker-compose');

const startIpfs = function(options = {}) {
  compose.up({ cwd: path.join(__dirname, '../') });
};

const stopIpfs = function(options = {}) {
  compose.down({ cwd: path.join(__dirname, '../') })
};

module.exports = {
  startIpfs,
  stopIpfs
};
