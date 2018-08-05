#!/usr/bin/env node

const Docker = require('dockerode');
const each = require('async/each');

const contracts = require('../config');

let docker = new Docker();

const compile = function(contract, next) {
  console.log(`[Contracts] Starting to compile ${contract.name}`);
  const command = [
    '-o',
    `/solidity/build/${contract.name}`,
    '--allow-paths',
    '/solidity/src',
    '--optimize',
    '--abi',
    '--bin',
    '--bin-runtime',
    '--metadata',
    '--ast',
    '--asm',
    '--overwrite',
    `/solidity/src/${contract.name}`];
  const options = { Binds: [`${__dirname}/../src:/solidity/src`, `${__dirname}/../build:/solidity/build`] };
  docker.run('ethereum/solc:0.4.24', command, process.stdout, options).then(function(container) {
    return container.remove();
  }).then(function() {
    console.log(`[Contracts] Finished to compile ${contract.name}`);
    next();
  }).catch(function(err) {
    console.log(`[Contracts] Error while compiling ${contract.name}`);
    console.log(err);
  });
};

each(contracts, function(contract, next) {
  compile(contract, next);
}, function(){
  console.log("[Contracts] All contract compiled");
});
