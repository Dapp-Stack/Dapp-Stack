import { fork } from 'redux-saga/effects';

import * as config from './config';
import * as files from './files';

export default function* ipfsSaga () {
  yield [
    fork(config.load),
    fork(files.load),
  ];
}