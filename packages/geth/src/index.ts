import * as Docker from 'dockerode';
import * as path from 'path';
import * as fs from 'fs';
import { Environment } from '@solon/environment';

let docker = new Docker();

const IMAGE_NAME = 'ethereum/client-go:latest'

export function start(environment: Environment): Promise<void> {
  const env = getSolonEnv();

  return new Promise<void>(async (resolve, reject) => {
    if (!environment.services.geth) {
      return resolve();
    }
    const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', env, 'geth.log'));
    const datadir = path.join(process.cwd(), '.solon', env);
    const remoteDataDir = `/root/.ethereum/${env}`;
    const command = getCommand(environment.services.geth.type, remoteDataDir);

    try {
      const containerInfo = await findContainerInfo();
      if (containerInfo) {
        resolve();
      }

      await downloadImage();

      let container = await docker.createContainer({
        name: containerName(),
        Image: IMAGE_NAME,
        Cmd: command,
        HostConfig: { 
          Binds: [`${datadir}:${remoteDataDir}:rw`], 
          PortBindings: {
            "8545/tcp": [{
              "HostPort": "8545"
            }],
            "8546/tcp": [{
              "HostPort": "8546"
            }],
          }
        }
      });
      
      container.attach({stream: true, sdtin: true, sdterr: true, sdtout: true}, function (_err, stream) {
        if (stream) {
          stream.pipe(logStream);
        }
      });

      await container.start();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export function startConsole(options = {}) {
};

export function stop(options = {}): Promise<void> {
  getSolonEnv();
  return new Promise<void>(async (resolve, reject) => {
    try {
      let containerInfo = await findContainerInfo();

      if (containerInfo) {
        let container = docker.getContainer(containerInfo.Id);
        await container.stop();
        await container.remove();
      }
      resolve();
    } catch(error) {
      reject(error);
    }
  });
};

function findContainerInfo(): Promise<Docker.ContainerInfo | undefined> {
  return new Promise<Docker.ContainerInfo | undefined> (async (resolve, reject) => {
    try {
      let containers = await docker.listContainers();
      let containerInfo = containers.find((c) => c.Names[0] === `/${containerName()}`)
      resolve(containerInfo);
    } catch (error) {
      reject(error);
    }
  });
};

function containerName(): string {
  return `geth-${getSolonEnv()}`;
}

function getSolonEnv(): string {
  if (!process.env.SOLON_ENV) {
    process.env.SOLON_ENV = 'local';
  }

  return process.env.SOLON_ENV;
}

function getCommand(type: string, remoteDataDir: string): string[] {
  switch (type) {
    case 'dev':
      return [
        '--dev',
        '--datadir', remoteDataDir,
        '--ws',
        '--wsaddr', "0.0.0.0",
        '--wsorigins', "*",
        '--wsport', "8546",
        '--rpc',
        '--rpcapi', "db,personal,eth,net,web3",
        '--rpcaddr', "0.0.0.0",
        '--rpcport', '8545',
        '--rpccorsdomain', '*',
        '--nodiscover'
      ]
    case 'ropsten':
      return [''];
    case 'mainnet':
      return [''];
    default:
      return [''];
  }
}

function downloadImage(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    docker.pull(IMAGE_NAME, {}, (err, stream) => {
      if(err) {
        return reject(err);
      }
      docker.modem.followProgress(stream, onFinished);

      function onFinished() {
        return resolve(true);
      }
    });
  });
}
