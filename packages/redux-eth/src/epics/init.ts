import { Epic } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { init, Web3Action } from '../actions';
import { Web3State } from '../reducers';
import * as api from '../services/api';

const connect: Epic<Web3Action, Web3Action, Web3State> = action$ =>
  action$.pipe(
    filter(isActionOf(init.request.connect.request)),
    switchMap(action =>
      from(api.connect()).pipe(
        map(config.request.load.success),
        catchError(map(config.request.load.failure)),
      ),
    ),
  );

const watchStart: Epic<Web3Action, Web3Action, Web3State> = action$ =>
  action$.pipe(
    filter(isActionOf(init.start)),
    map(init.request.connect.request),
  );

export default [watchStart];
