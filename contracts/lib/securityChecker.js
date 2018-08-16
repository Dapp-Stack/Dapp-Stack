const Docker = require('dockerode');
const fs = require('fs-extra');

let docker = new Docker();

const dockerMyth = async function(contractName) {
  const filename = `${__dirname}/../health/${contractName}`.replace('.sol', '.md');
  await fs.ensureFile(filename);
  let stream = fs.createWriteStream(filename);
  const command = [ '-o', 'markdown', '-x', `/solidity/src/${contractName}`];
  const options = { Binds: [`${__dirname}/../src:/solidity/src`] };
  return docker.run('mythril/myth', command, stream, options).then(function(container) {
    return container.remove();
  });
};

const securityCheck = function(contractName) {
  console.log(`[Contracts] Starting the security check on ${contractName}`);
  return dockerMyth(contractName).then(function() {
    console.log(`[Contracts] Finished the security check on ${contractName}`);
  }).catch(function(err) {
    console.log(`[Contracts] Error while checking the security on ${contractName}`);
    console.log(err);
  });
};

module.exports = {
  securityCheck
};
