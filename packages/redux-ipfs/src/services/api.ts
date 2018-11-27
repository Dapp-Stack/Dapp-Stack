import * as API from 'ipfs-api'
import * as path from 'path'

import { File } from '../types'

const host =
  process.env.NODE_ENV !== 'production' ? 'localhost' : window.location.hostname
const port =
  process.env.NODE_ENV !== 'production' ? '5001' : window.location.port || 80
const localApi = new API(host, port)

export const id = localApi.id

export const ls = (root: string, api = localApi): Promise<File[]> => {
  return api.files.ls(root, { l: true })
}

export const mkdir = (
  root: string,
  name: string,
  api = localApi
): Promise<void> => {
  const target = path.join(root, name)
  return api.files.mkdir(target)
}

export const rm = (
  root: string,
  name: string,
  api = localApi
): Promise<void> => {
  const target = path.join(root, name)
  return api.files.rm(target, { recursive: true })
}

export const touch = (
  root: string,
  name: string,
  content: null | string | ArrayBuffer,
  api = localApi
): Promise<void> => {
  const target = path.join(root, name)
  return api.files.write(target, api.Buffer.from(content), { create: true })
}

export const cat = (
  root: string,
  name: string,
  api = localApi
): Promise<string> => {
  const target = path.join(root, name)
  return api.files
    .read(target)
    .then((buffer: Buffer) => buffer.toString('utf8'))
}
