export type Config = { host: string; port: string; protocol: string };

export type File = {
  name: string;
  size: number;
  hash: string;
  type: 'file' | 'directory';
};