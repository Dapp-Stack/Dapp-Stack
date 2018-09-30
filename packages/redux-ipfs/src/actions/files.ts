import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { File } from '../types';

export const request = {
  ls: createAsyncAction('IPFS/LS/REQUEST', 'IPFS/LS/SUCCESS', 'IPFS/LS/FAILURE')<void, File[], Error>(),

  mkdir: createAsyncAction('IPFS/MKDIR/REQUEST', 'IPFS/MKDIR/SUCCESS', 'IPFS/MKDIR/FAILURE')<
    void,
    boolean,
    Error
  >(),

  rmDir: createAsyncAction('IPFS/RMDIR/REQUEST', 'IPFS/RMDIR/SUCCESS', 'IPFS/RMDIR/FAILURE')<
    void,
    boolean,
    Error
  >(),

  touch: createAsyncAction('IPFS/TOUCH/REQUEST', 'IPFS/TOUCH/SUCCESS', 'IPFS/TOUCH/FAILURE')<
    void,
    boolean,
    Error
  >(),

  rm: createAsyncAction('IPFS/RM/REQUEST', 'IPFS/RM/SUCCESS', 'IPFS/RM/FAILURE')<void, boolean, Error>(),

  cat: createAsyncAction('IPFS/CAT/REQUEST', 'IPFS/CAT/SUCCESS', 'IPFS/CAT/FAILURE')<void, boolean, Error>(),
};

export const cwd = (root: string) => createStandardAction('IPFS/CWD')<void>();
export const ls = () => createStandardAction('IPFS/LS')<void>();
export const touch = () => createStandardAction('IPFS/TOUCH')<void>();
export const mkdir = (path: string) => createStandardAction('IPFS/MKDIR')<void>();
export const rmdir = (path: string) => createStandardAction('IPFS/RMDIR')<void>();
export const rm = (path: string) => createStandardAction('IPFS/RM')<void>();
export const cat = (name: string) => createStandardAction('IPFS/CAT')<void>();
