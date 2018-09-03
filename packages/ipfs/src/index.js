"use strict";

const compose = require('docker-compose');

export function startIpf(options = {}) {
  compose.up({ cwd: path.join(__dirname, '../') });
};

export function stopIpfs(options = {}) {
  compose.down({ cwd: path.join(__dirname, '../') })
};

module.exports = {
  startIpfs,
  stopIpfs
};
