import API from 'ipfs-api';
import { sortBy } from 'lodash';
import * as path from 'path';
import * as bl from 'bl';

type Config = { host: string; port: string; protocol: string };

const host = process.env.NODE_ENV !== 'production' ? 'localhost' : window.location.hostname;
const port = process.env.NODE_ENV !== 'production' ? '5001' : window.location.port || 80;
const localApi: API = new API(host, port);

const collect = stream => {
  return new Promise((resolve, reject) => {
    stream.pipe(
      bl((error: Error, buffer: Buffer) => {
        if (error) return reject(error);
        resolve(buffer);
      }),
    );
  });
};

export const id = localApi.id;

export const files = {
  list: (root: string, api = localApi) => {
    return api.files.ls(root).then(res => {
      const files = sortBy(res.Entries, 'Name') || [];

      return Promise.all(
        files.map(file => {
          return api.files.stat(path.join(root, file.Name)).then(stats => {
            return { ...file, ...stats };
          });
        }),
      );
    });
  },

  mkdir: (name: string, api = localApi) => {
    return api.files.mkdir(name);
  },

  rmdir: (name: string, api = localApi) => {
    return api.files.rm(name, { recursive: true });
  },

  createFiles: (root: string, files: window.File[], api = localApi) => {
    return Promise.all(
      files.map(file => {
        const target = path.join(root, file.name);
        return api.files.write(target, file.content, { create: true });
      }),
    );
  },

  stat: (name: string, api = localApi) => {
    return api.files.stat(name);
  },

  read: (name: string, api = localApi) => {
    return api.files.read(name).then(collect);
  },
};

export const getConfig = async (api = localApi) => {
  let config: Buffer = await api.config.get();
  return JSON.parse(config.toString());
};

export const saveConfig = (config: Config, api = localApi) => {
  return api.config.replace(config);
};
