import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { FILES_LIST, FILES_MKDIR, FILES_RMDIR, FILES_CREATE_FILES } from '../types';

export const request = {
  ls: createAsyncAction(
    'IPFS/LS/REQUEST',
    'IPFS/LS/SUCCESS',
    'IPFS/LS/FAILURE',
  )<void, FILES_LIST, Error>(),

  mkdir: createAsyncAction(
    'IPFS/MKDIR/REQUEST',
    'IPFS/MKDIR/SUCCESS',
    'IPFS/MKDIR/FAILURE',
  )<void, FILES_MKDIR, Error>(),

  rmDir: createAsyncAction(
    'IPFS/RMDIR/REQUEST',
    'IPFS/RMDIR/SUCCESS',
    'IPFS/RMDIR/FAILURE',
  )<void, FILES_RMDIR, Error>(),

  touch: createAsyncAction(
    'IPFS/TOUCH/REQUEST',
    'IPFS/TOUCH/SUCCESS',
    'IPFS/TOUCH/FAILURE',
  )<void, FILES_CREATE_FILES, Error>(),

  rm: createAsyncAction(
    'IPFS/RM/REQUEST',
    'IPFS/RM/SUCCESS',
    'IPFS/RM/FAILURE',
  )<void, void, Error>(),

  cat: createAsyncAction(
    'IPFS/CAT/REQUEST',
    'IPFS/CAT/SUCCESS',
    'IPFS/CAT/FAILURE',
  )<void, void, Error>(),
};

export const cwd = (root: string) => createStandardAction('IPFS/CWD')<void>();
export const ls = (name: string) => createStandardAction('IPFS/LS')<void>();
export const touch = () => createStandardAction('IPFS/TOUCH')<void>();
export const mkdir = (path: string) => createStandardAction('IPFS/MKDIR')<void>();
export const rmdir = (path: string) => createStandardAction('IPFS/RMDIR')<void>();
export const rm = (path: string) => createStandardAction('IPFS/RM')<void>();
export const cat = (name: string) => createStandardAction('IPFS/CAT')<void>();
