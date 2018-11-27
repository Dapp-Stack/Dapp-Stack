import { createAsyncAction, createStandardAction } from 'typesafe-actions'

import { File } from '../types'

type CreateFileInput = {
  name: string
  content: null | string | ArrayBuffer
}

export const request = {
  ls: createAsyncAction(
    'IPFS/LS/REQUEST',
    'IPFS/LS/SUCCESS',
    'IPFS/LS/FAILURE'
  )<void, File[], Error>(),

  cat: createAsyncAction(
    'IPFS/CAT/REQUEST',
    'IPFS/CAT/SUCCESS',
    'IPFS/CAT/FAILURE'
  )<string, string, Error>(),

  rm: createAsyncAction(
    'IPFS/RM/REQUEST',
    'IPFS/RM/SUCCESS',
    'IPFS/RM/FAILURE'
  )<string, void, Error>(),

  touch: createAsyncAction(
    'IPFS/TOUCH/REQUEST',
    'IPFS/TOUCH/SUCCESS',
    'IPFS/TOUCH/FAILURE'
  )<CreateFileInput, void, Error>(),

  mkdir: createAsyncAction(
    'IPFS/MKDIR/REQUEST',
    'IPFS/MKDIR/SUCCESS',
    'IPFS/MKDIR/FAILURE'
  )<string, void, Error>(),

  rmdir: createAsyncAction(
    'IPFS/RMDIR/REQUEST',
    'IPFS/RMDIR/SUCCESS',
    'IPFS/RMDIR/FAILURE'
  )<string, void, Error>()
}

export const cwd = createStandardAction('IPFS/CWD')<string>()

export const ls = createStandardAction('IPFS/LS')<void>()
export const rm = createStandardAction('IPFS/RM')<string>()
export const cat = createStandardAction('IPFS/CAT')<string>()
export const touch = createStandardAction('IPFS/TOUCH')<CreateFileInput>()
export const mkdir = createStandardAction('IPFS/MKDIR')<string>()
export const rmdir = createStandardAction('IPFS/RMDIR')<string>()
