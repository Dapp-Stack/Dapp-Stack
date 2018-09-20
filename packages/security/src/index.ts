import { Compile, Structure } from '@solon/environment';
import { Signale } from 'signale';
import * as dockerode from 'dockerode';
import * as fs from 'fs-extra';
import * as path from 'path';

let docker = new dockerode();

const IMAGE_NAME = 'mythril/myth:latest';
const signale = new Signale({ scope: 'Security' });

export const run = async (compile: Compile) => {
  let isDockerRunning: boolean = await pingDocker();
  if (!isDockerRunning) {
    signale.error(new Error("Docker is not running"))
    process.exit(1);
  }
  await downloadImage();
  signale.await("Running security checks")
  compile.contracts.forEach(contract => runCheck(contract));
};

const pingDocker = async () => {
  try {
    await docker.ping();
    return true;
  } catch {
    return false;
  }
}

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
  signale.await("Downloading docker image (it may take a while)...");

  return new Promise<boolean>(async (resolve, reject) => {
    docker.pull(IMAGE_NAME, {}, (err, stream) => {
      if (err) {
        return reject(err);
      }
      docker.modem.followProgress(stream, onFinished);
      function onFinished() {
        signale.success("Docker image downloaded");
        return resolve(true);
      }
    });
  });
};
