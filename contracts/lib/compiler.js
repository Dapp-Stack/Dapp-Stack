const Docker = require('dockerode');

let docker = new Docker();

const dockerSolc = function(contractName) {
  const command = [
    '-o',
    `/solidity/build/${contractName}`,
    '--allow-paths',
    '/solidity/src',
    '--optimize',
    '--combined-json',
    'abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc',
    '--overwrite',
    `/solidity/src/${contractName}`];
  const options = { Binds: [`${__dirname}/../src:/solidity/src`, `${__dirname}/../build:/solidity/build`] };
  return docker.run('ethereum/solc:0.4.24', command, process.stdout, options).then(function(container) {
    return container.remove();
  });
};

const compile = function(contractName) {
  console.log(`[Contracts] Starting to compile ${contractName}`);
  return dockerSolc(contractName).then(function() {
    console.log(`[Contracts] Finished to compile ${contractName}`);
  }).catch(function(err) {
    console.log(`[Contracts] Error while compiling ${contractName}`);
    console.log(err);
  });
};

module.exports = {
  compile
};
