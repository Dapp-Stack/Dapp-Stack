import API from 'ipfs-api';
import { sortBy } from 'lodash';
import * as path from 'path';

const bl = require('bl');

import { Config } from '../types';
import { Stream } from 'stream';


type Stat = {
  hash: string;
  size: number;
  cumulativeSize: number;
  blocks: number;
  type: string;
}

type File = {
  name: string;
  size: number;
  hash: string;
  type: 'file' | 'directory';
}
type FileWithStat = File & Stat;

const host = process.env.NODE_ENV !== 'production' ? 'localhost' : window.location.hostname;
const port = process.env.NODE_ENV !== 'production' ? '5001' : window.location.port || 80;
const localApi = new API(host, port);

const collect = (stream: Stream) => {
  return new Promise((resolve, reject) => {
    stream.pipe(
      new bl((error: Error, buffer: Buffer) => {
        if (error) return reject(error);
        resolve(buffer);
      }),
    );
  });
};

export const id = localApi.id;

export const files = {
  list: (root: string, api = localApi): Promise<Promise<FileWithStat[]>> => {
    return api.files.ls(root).then((res: File[]) => {
      const files = sortBy(res, 'name') || [];

      return Promise.all(
        files.map(file => {
          return api.files.stat(path.join(root, file.name)).then((stat: Stat) => {
            return { ...file, ...stat };
          });
        }),
      );
    });
  },

  mkdir: (name: string, api = localApi): Promise<void> => {
    return api.files.mkdir(name);
  },

  rmdir: (name: string, api = localApi): Promise<void> => {
    return api.files.rm(name, { recursive: true });
  },

  createFiles: (root: string, files: window.File[], api = localApi): Promise<void[]> => {
    return Promise.all(
      files.map((file: File) => {
        const target = path.join(root, file.name);
        return api.files.write(target, file, { create: true });
      }),
    );
  },

  stat: (name: string, api = localApi): Promise<Stat> => {
    return api.files.stat(name);
  },

  read: (name: string, api = localApi): Promise<string> => {
    return api.files.read(name).then(collect);
  },
};

export const getConfig = async (api = localApi): Promise<Config> => {
  let config: Buffer = await api.config.get();
  return JSON.parse(config.toString('utf8'));
};

export const saveConfig = (config: Config, api = localApi) => {
  return api.config.replace(config);
};
