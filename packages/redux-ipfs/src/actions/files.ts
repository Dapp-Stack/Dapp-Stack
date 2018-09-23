import { createRequestTypes, action } from './utils';

export const requests = {
  FILES_LIST: createRequestTypes('FILES_LIST'),
  FILES_MKDIR: createRequestTypes('FILES_MKDIR'),
  FILES_RMDIR: createRequestTypes('FILES_RMDIR'),
  FILES_CREATE_FILES: createRequestTypes('FILES_CREATE_FILES'),
  list: {
    request: () => action(requests.FILES_LIST.REQUEST),
    success: response => action(requests.FILES_LIST.SUCCESS, { response }),
    failure: error => action(requests.FILES_LIST.FAILURE, { error }),
  },
  mkdir: {
    request: () => action(requests.FILES_MKDIR.REQUEST),
    success: () => action(requests.FILES_MKDIR.SUCCESS),
    failure: error => action(requests.FILES_MKDIR.FAILURE, { error }),
  },
  rmDir: {
    request: () => action(requests.FILES_RMDIR.REQUEST),
    success: () => action(requests.FILES_RMDIR.SUCCESS),
    failure: error => action(requests.FILES_RMDIR.FAILURE, { error }),
  },
  createFiles: {
    request: () => action(requests.FILES_CREATE_FILES.REQUEST),
    success: () => action(requests.FILES_CREATE_FILES.SUCCESS),
    failure: error => action(requests.FILES_CREATE_FILES.FAILURE, { error }),
  },
};

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

export const mount = () => action(FILES.MOUNT);
export const unmount = () => action(FILES.UNMOUNT);
export const cancel = () => action(FILES.CANCEL);

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
