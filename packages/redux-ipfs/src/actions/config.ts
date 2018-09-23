
import { createAsyncAction } from 'typesafe-actions';
import { Config } from '../types';

export const load = createAsyncAction(
  'CONFIG_LOAD/REQUEST',
  'CONFIG_LOAD/SUCCESS',
  'CONFIG_LOAD/FAILURE'
)<void, Config, Error>();