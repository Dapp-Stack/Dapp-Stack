import { Epic } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, map, mergeMap, filter } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { files, IpfsAction } from '../actions'
import { IpfsState } from '../reducers'
import * as api from '../services/api'

const ls: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.ls.request)),
    mergeMap(() =>
      from(api.ls(state$.value.ipfs.files.root)).pipe(
        map(files.request.ls.success),
        catchError(error => of(files.request.ls.failure(error)))
      )
    )
  )

const watchLs: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.ls)),
    map(files.request.ls.request)
  )

const cat: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.cat.request)),
    mergeMap(action =>
      from(api.cat(state$.value.ipfs.files.root, action.payload)).pipe(
        map(files.request.cat.success),
        catchError(error => of(files.request.cat.failure(error)))
      )
    )
  )

const watchCat: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.cat)),
    map(action => files.request.cat.request(action.payload))
  )

const rm: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.rm.request)),
    mergeMap(action =>
      from(api.rm(state$.value.ipfs.files.root, action.payload)).pipe(
        map(files.request.rm.success),
        catchError(error => of(files.request.rm.failure(error)))
      )
    )
  )

const watchRm: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.rm)),
    map(action => files.request.rm.request(action.payload))
  )

const watchRmSuccess: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.rm.success)),
    map(files.ls)
  )

const touch: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.touch.request)),
    mergeMap(action =>
      from(
        api.touch(
          state$.value.ipfs.files.root,
          action.payload.name,
          action.payload.content
        )
      ).pipe(
        map(files.request.touch.success),
        catchError(error => of(files.request.touch.failure(error)))
      )
    )
  )

const watchTouch: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.touch)),
    map(action => files.request.touch.request(action.payload))
  )

const watchTouchSuccess: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.touch.success)),
    map(files.ls)
  )

const mkdir: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.mkdir.request)),
    mergeMap(action =>
      from(api.mkdir(state$.value.ipfs.files.root, action.payload)).pipe(
        map(files.request.mkdir.success, files.ls),
        catchError(error => of(files.request.mkdir.failure(error)))
      )
    )
  )

const watchMkdir: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.mkdir)),
    map(action => files.request.mkdir.request(action.payload))
  )

const watchMkdirSuccess: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.mkdir.success)),
    map(files.ls)
  )

const rmdir: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.rmdir.request)),
    mergeMap(action =>
      from(api.rm(state$.value.ipfs.files.root, action.payload)).pipe(
        map(files.request.rmdir.success, files.ls),
        catchError(error => of(files.request.rmdir.failure(error)))
      )
    )
  )

const watchRmdir: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.rmdir)),
    map(action => files.request.rmdir.request(action.payload))
  )

const watchRmdirSuccess: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.rmdir.success)),
    map(files.ls)
  )

export default [
  watchLs,
  ls,
  watchCat,
  cat,
  watchRm,
  watchRmSuccess,
  rm,
  watchTouch,
  watchTouchSuccess,
  touch,
  watchMkdir,
  watchMkdirSuccess,
  mkdir,
  watchRmdir,
  watchRmdirSuccess,
  rmdir
]
