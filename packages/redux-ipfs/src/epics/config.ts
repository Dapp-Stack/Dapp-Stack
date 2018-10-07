import { Epic } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { config, IpfsAction } from '../actions';
import { IpfsState } from '../reducers';
import * as api from '../services/api';

const loadConfig: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(config.request.load.request)),
    switchMap(action =>
      from(api.getConfig()).pipe(
        map(config.request.load.success),
        catchError(map(config.request.load.failure)),
      ),
    ),
  );

const watchConfig: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(config.init)),
    map(config.request.load.request),
  );

export default [watchConfig, loadConfig];
