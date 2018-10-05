import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { from } from 'rxjs';
import { Epic } from "redux-observable";
import { isActionOf } from 'typesafe-actions';

import * as api from '../services/api';
import { init, Web3Action } from '../actions';
import { Web3State } from '../reducers';

const connect: Epic<Web3Action, Web3Action, Web3State> = (action$) => action$.pipe(
  filter(isActionOf(init.request.connect.request)),
  switchMap(action =>
    from(api.connect()).pipe(
      map(config.request.load.success),
      catchError(map(config.request.load.failure))
    )
  )
);

const watchStart: Epic<Web3Action, Web3Action, Web3State> = (action$) => action$.pipe(
  filter(isActionOf(init.start)),
  map(init.request.connect.request)
);

export default [
  watchStart
];