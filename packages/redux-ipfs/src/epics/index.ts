import { combineEpics } from 'redux-observable';

import config from './config';
import files from './files';

const epics = combineEpics(
  ...config,
  ...files
);

export default epics;