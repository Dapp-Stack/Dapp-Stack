"use strict";

const compose = require('docker-compose');

const startGeth = function(options = {}) {
  compose.up({ cwd: path.join(__dirname, '../') });
};

const startConsole = function(options = {}) {
  compose.run('geth', 'geth attach ipc:/root/.ethereum/$SOLON_ENV/geth.ipc', { cwd: path.join(__dirname, '../') });
};

const stopGeth = function(options = {}) {
  compose.down({ cwd: path.join(__dirname, '../') })
};

module.exports = {
  startGeth,
  startConsole,
  stopGeth
};
