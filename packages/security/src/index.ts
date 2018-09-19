import { Compile, Structure } from '@solon/environment';
import * as dockerode from 'dockerode';
import * as fs from 'fs-extra';
import * as path from 'path';

let docker = new dockerode();

const IMAGE_NAME = 'mythril/myth';

const run = async (compile: Compile) => {
  await downloadImage();
  compile.contracts.forEach(contract => runCheck(contract));
};

const runCheck = async function(contractName: string) {
  const securityFile = path.join(Structure.contracts.security, contractName.replace('.sol', '.md'));
  await fs.ensureFile(securityFile);
  let stream = fs.createWriteStream(securityFile);
  const command = ['-o', 'markdown', '-x', `/solidity/src/${contractName}`];
  const options = { Binds: [`${Structure.contracts.src}:/solidity/src`] };
  return docker.run('mythril/myth', command, stream, options).then(function(container) {
    return container.remove();
  });
};

const downloadImage = (): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    docker.pull(IMAGE_NAME, {}, (err, stream) => {
      if (err) {
        return reject(err);
      }
      docker.modem.followProgress(stream, onFinished);
      function onFinished() {
        return resolve(true);
      }
    });
  });
};
