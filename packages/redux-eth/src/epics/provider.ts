import { Epic } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, filter, map, mergeMap } from 'rxjs/operators'
import { isActionOf, getType } from 'typesafe-actions'

import { provider, EthAction } from '../actions'
import { EthState } from '../reducers'
import * as api from '../services/api'

const network: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.network.request)),
    mergeMap(_action =>
      from(api.getNetwork(state$.value.eth.provider.instance)).pipe(
        map(provider.request.network.success),
        catchError(error => of(provider.request.network.failure(error)))
      )
    )
  )

const gasPrice: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.gasPrice.request)),
    mergeMap(_action =>
      from(api.getGasPrice(state$.value.eth.provider.instance)).pipe(
        map(provider.request.gasPrice.success),
        catchError(error => of(provider.request.gasPrice.failure(error)))
      )
    )
  )

const address: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.address.request)),
    mergeMap(_action =>
      from(api.getAddress(state$.value.eth.provider.instance)).pipe(
        map(provider.request.address.success),
        catchError(error => of(provider.request.address.failure(error)))
      )
    )
  )

const balance: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.balance.request)),
    mergeMap(_action =>
      from(api.getBalance(state$.value.eth.provider.instance)).pipe(
        map(provider.request.balance.success),
        catchError(error => of(provider.request.balance.failure(error)))
      )
    )
  )

const blockNumber: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.blockNumber.request)),
    mergeMap(_action =>
      from(api.getBlockNumber(state$.value.eth.provider.instance)).pipe(
        map(provider.request.blockNumber.success),
        catchError(error => of(provider.request.blockNumber.failure(error)))
      )
    )
  )

const block: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.block.request)),
    mergeMap(action =>
      from(
        api.getBlock(state$.value.eth.provider.instance, action.payload)
      ).pipe(
        map(provider.request.block.success),
        catchError(error => of(provider.request.block.failure(error)))
      )
    )
  )

const transaction: Epic<EthAction, EthAction, EthState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(provider.request.transaction.request)),
    mergeMap(action =>
      from(
        api.getTransaction(state$.value.eth.provider.instance, action.payload)
      ).pipe(
        map(provider.request.transaction.success),
        catchError(error => of(provider.request.transaction.failure(error)))
      )
    )
  )

const transactionCount: Epic<EthAction, EthAction, EthState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isActionOf(provider.request.transactionCount.request)),
    mergeMap(_action =>
      from(api.getTransactionCount(state$.value.eth.provider.instance)).pipe(
        map(provider.request.transactionCount.success),
        catchError(error =>
          of(provider.request.transactionCount.failure(error))
        )
      )
    )
  )

const connect: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.request)),
    mergeMap(_action =>
      from(api.connect()).pipe(
        map(provider.request.connect.success),
        catchError(error => of(provider.request.connect.failure(error)))
      )
    )
  )

const watchStart: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.start)),
    map(provider.request.connect.request)
  )

const watchFindBlock: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.findBlock)),
    map(action => provider.request.block.request(action.payload))
  )

const watchFindTransaction: Epic<EthAction, EthAction, EthState> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.findTransaction)),
    map(action => provider.request.transaction.request(action.payload))
  )

const watchConnectSuccessForGasPrice: Epic<
  EthAction,
  EthAction,
  EthState
> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.gasPrice.request)
  )

const watchConnectSuccessForNetwork: Epic<
  EthAction,
  EthAction,
  EthState
> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.network.request)
  )

const watchConnectSuccessForAddress: Epic<
  EthAction,
  EthAction,
  EthState
> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.address.request)
  )

const watchConnectSuccessForBalance: Epic<
  EthAction,
  EthAction,
  EthState
> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.balance.request)
  )

const watchConnectSuccessForBlockNumber: Epic<
  EthAction,
  EthAction,
  EthState
> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.blockNumber.request)
  )

const watchConnectSuccessForTransactionCount: Epic<
  EthAction,
  EthAction,
  EthState
> = action$ =>
  action$.pipe(
    filter(isActionOf(provider.request.connect.success)),
    map(provider.request.transactionCount.request)
  )

export default [
  connect,
  watchStart,
  watchFindBlock,
  watchFindTransaction,
  watchConnectSuccessForGasPrice,
  watchConnectSuccessForNetwork,
  watchConnectSuccessForAddress,
  watchConnectSuccessForBalance,
  watchConnectSuccessForTransactionCount,
  watchConnectSuccessForBlockNumber,
  network,
  gasPrice,
  balance,
  address,
  blockNumber,
  transactionCount,
  transaction,
  block
]
