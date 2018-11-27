import { Epic } from 'redux-observable'
import { from } from 'rxjs'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { contracts, EthAction } from '../actions'
import { EthState } from '../reducers'
import * as api from '../services/api'

const loadContracts: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(contracts.request.contracts.request)),
    switchMap(action =>
      from(
        api.getContracts(state$.value.eth.provider.instance, action.payload)
      ).pipe(
        map(contracts.request.contracts.success),
        catchError(map(contracts.request.contracts.failure))
      )
    )
  )

const watchContracts: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(contracts.load)),
    map(action => contracts.request.contracts.request(action.payload))
  )

export default [watchContracts, loadContracts]
