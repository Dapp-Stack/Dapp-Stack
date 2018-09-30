import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { Config } from '../types';

export const request = {
  load: createAsyncAction('IPFS/CONFIG_LOAD/REQUEST', 'IPFS/CONFIG_LOAD/SUCCESS', 'IPFS/CONFIG_LOAD/FAILURE')<
    void,
    Config,
    Error
  >(),
};

export const init = createStandardAction('IPFS/INIT')<void>();
