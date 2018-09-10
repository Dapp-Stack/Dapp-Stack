import * as Docker from 'dockerode';
import * as path from 'path';
import * as fs from 'fs';
import { Environment } from '@solon/environment';
import { rejects } from 'assert';

let docker = new Docker();

const IMAGE_NAME = 'ipfs/go-ipfs:latest';

export function start(environment: Environment): Promise<void> {
  const env = getSolonEnv();

  return new Promise<void>(async (resolve, reject) => {
    if (!environment.services.ipfs) {
      return resolve();
    }

    const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', env, 'ipfs.log'));

    try {
      const containerInfo = await findContainerInfo();
      if (containerInfo) {
        resolve();
      }
      await downloadImage();

      let container = await docker.createContainer({
        name: containerName(),
        Image: IMAGE_NAME,
        HostConfig: {
          Binds: [
            `${path.join(process.cwd(), '.solon', 'ipfs', 'staging')}:/export:rw`,
            `${path.join(process.cwd(), '.solon', 'ipfs', 'data')}:/data/ipfs:rw`,
          ],
        },
      });

      container.attach({ stream: true, sdtin: true, sdterr: true, sdtout: true }, function(_err, stream) {
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
}

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
    } catch (error) {
      reject(error);
    }
  });
}

function findContainerInfo(): Promise<Docker.ContainerInfo | undefined> {
  return new Promise<Docker.ContainerInfo | undefined>(async (resolve, reject) => {
    try {
      let containers = await docker.listContainers();
      let containerInfo = containers.find(c => c.Names[0] === `/${containerName()}`);
      resolve(containerInfo);
    } catch (error) {
      reject(error);
    }
  });
}

function containerName(): string {
  return `ipfs-${getSolonEnv()}`;
}

function getSolonEnv(): string {
  if (!process.env.SOLON_ENV) {
    process.env.SOLON_ENV = 'local';
  }

  return process.env.SOLON_ENV;
}

function downloadImage(): Promise<boolean> {
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
}
