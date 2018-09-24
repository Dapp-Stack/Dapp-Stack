import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { FILES_LIST, FILES_MKDIR, FILES_RMDIR, FILES_CREATE_FILES } from '../types';

export const list = createAsyncAction(
  'FILES_LIST/REQUEST',
  'FILES_LIST/SUCCESS',
  'FILES_LIST/FAILURE'
)<void, FILES_LIST, Error>();

export const mkdir = createAsyncAction(
  'FILES_MKDIR/REQUEST',
  'FILES_MKDIR/SUCCESS',
  'FILES_MKDIR/FAILURE'
)<void, FILES_MKDIR, Error>();

export const rmDir = createAsyncAction(
  'FILES_RMDIR/REQUEST',
  'FILES_RMDIR/SUCCESS',
  'FILES_RMDIR/FAILURE'
)<void, FILES_RMDIR, Error>();

export const createFiles = createAsyncAction(
  'FILES_CREATE_FILES/REQUEST',
  'FILES_CREATE_FILES/SUCCESS',
  'FILES_CREATE_FILES/FAILURE'
)<void, FILES_CREATE_FILES, Error>();


export const FILES = {
  MOUNT: 'FILES.MOUNT',
  UNMOUNT: 'FILES.UNMOUNT',
  CANCEL: 'FILES.CANCEL',
  SET_ROOT: 'FILES.SET_ROOT',
  CREATE_TMP_DIR: 'FILES.CREATE_TMP_DIR',
  RM_TMP_DIR: 'FILES.RM_TMP_DIR',
  SET_TMP_DIR_NAME: 'FILES.SET_TMP_DIR_NAME',
  CREATE_DIR: 'FILES.CREATE_DIR',
  REMOVE_DIR: 'FILES.REMOVE_DIR',
  SELECT: 'FILES.SELECT',
  DESELECT: 'FILES.DESELECT',
  DESELECT_ALL: 'FILES.DESELECT_ALL',
  CREATE_FILES: 'FILES.CREATE_FILES',
};

export const mount = createStandardAction('FILES_MOUNT')<void>();
export const unmount = createStandardAction('FILES_UNMOUNT')<void>();
export const cancel = createStandardAction('FILES_CANCEL')<void>();

export const setRoot = (root: string) => action(FILES.SET_ROOT, { root });
export const createTmpDir = (root: string) => action(FILES.CREATE_TMP_DIR, { root });
export const rmTmpDir = () => action(FILES.RM_TMP_DIR);
export const setTmpDirName = (name: string) => action(FILES.SET_TMP_DIR_NAME, { name });
export const createDir = () => action(FILES.CREATE_DIR);
export const removeDir = () => action(FILES.REMOVE_DIR);

export const select = file => action(FILES.SELECT_FILE, { file });
export const deselect = file => action(FILES.DESELECT_FILE, { file });
export const deselectAll = () => action(FILES.DESELECT_ALL_FILE);

export const createFiles = (root, files) => action(FILES.CREATE_FILES, { root, files });
