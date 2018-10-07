import { Epic } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { provider, EthAction } from '../actions';
import { EthState } from '../reducers';
import * as api from '../services/api';

const network: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.network.request)),
    switchMap(_action =>
      from(api.getNetwork(state$.value.provider.provider)).pipe(
        map(provider.request.network.success),
        catchError(map(provider.request.network.failure)),
      ),
    ),
  );

const gasPrice: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.gasPrice.request)),
    switchMap(_action =>
      from(api.getGasPrice(state$.value.provider.provider)).pipe(
        map(provider.request.gasPrice.success),
        catchError(map(provider.request.gasPrice.failure)),
      ),
    ),
  );

const connect: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.request)),
    switchMap(_action =>
      from(api.connect()).pipe(
        map(provider.request.connect.success),
        catchError(map(provider.request.connect.failure)),
      ),
    ),
  );

const watchStart: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.start)),
    map(provider.request.connect.request),
  );

const watchConnectSuccess: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.gasPrice.request, provider.request.network.request),
  );

export default [watchStart, watchConnectSuccess, connect, network, gasPrice];
