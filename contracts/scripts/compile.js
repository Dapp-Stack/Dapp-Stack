#!/usr/bin/env node

const Docker = require('dockerode');
const contracts = require('../config');

let docker = new Docker();

const dockerSolc = function(contract) {
  const command = [
    '-o',
    `/solidity/build/${contract.name}`,
    '--allow-paths',
    '/solidity/src',
    '--optimize',
    '--combined-json',
    'abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc',
    '--overwrite',
    `/solidity/src/${contract.name}`];
  const options = { Binds: [`${__dirname}/../src:/solidity/src`, `${__dirname}/../build:/solidity/build`] };
  return docker.run('ethereum/solc:0.4.24', command, process.stdout, options).then(function(container) {
    return container.remove();
  });
};

const compile = function(contract) {
  console.log(`[Contracts] Starting to compile ${contract.name}`);
  dockerSolc(contract).then(function() {
    console.log(`[Contracts] Finished to compile ${contract.name}`);
  }).catch(function(err) {
    console.log(`[Contracts] Error while compiling ${contract.name}`);
    console.log(err);
  });
};

const compileSingle = function(name) {
  let contract = contracts.find(c => c.name === name);
  compile(contract);
};

const compileAll = function() {
  contracts.map((contract) => {
    compile(contract);
  });
};

compileAll();

module.exports = {
  compileAll,
  compileSingle
};
