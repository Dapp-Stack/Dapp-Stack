import API from 'ipfs-api';
import { sortBy } from 'lodash';
import * as path from 'path';

const bl = require('bl');

import { Config, File } from '../types';
import { Stream } from 'stream';

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
  ls: (root: string, api = localApi): Promise<File[]> => {
    return api.files.ls(root);
  },

  mkdir: (name: string, api = localApi): Promise<void> => {
    return api.files.mkdir(name);
  },

  rmdir: (name: string, api = localApi): Promise<void> => {
    return api.files.rm(name, { recursive: true });
  },

  touch: (root: string, name: string, blob: Blob, api = localApi): Promise<void> => {
    const target = path.join(root, name);
    return api.files.write(target, blob, { create: true });
  },

  cat: (name: string, api = localApi): Promise<string> => {
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
