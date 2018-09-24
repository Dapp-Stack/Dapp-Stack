
import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { PREVIEW_STAT, PREVIEW_READ } from '../types';

export const stat = createAsyncAction(
  'PREVIEW_STAT/REQUEST',
  'PREVIEW_STAT/SUCCESS',
  'PREVIEW_STAT/FAILURE'
)<void, PREVIEW_STAT, Error>();

export const read = createAsyncAction(
  'PREVIEW_READ/REQUEST',
  'PREVIEW_READ/SUCCESS',
  'PREVIEW_READ/FAILURE'
)<void, PREVIEW_READ, Error>();

export const mount = createStandardAction('PREVIEW_MOUNT')<void>();
export const unmount = createStandardAction('PREVIEW_UNMOUNT')<void>();
export const clear = createStandardAction('PREVIEW_CLEAR')<void>();
