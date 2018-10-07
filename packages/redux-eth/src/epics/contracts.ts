import { Epic } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { files, IpfsAction } from '../actions';
import { IpfsState } from '../reducers';
import * as api from '../services/api';

const ls: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.ls.request)),
    switchMap(action =>
      from(api.ls(state$.value.files.root)).pipe(
        map(files.request.ls.success),
        catchError(map(files.request.ls.failure)),
      ),
    ),
  );

const watchLs: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.ls)),
    map(files.request.ls.request),
  );

const cat: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.cat.request)),
    switchMap(action =>
      from(api.cat(action.payload)).pipe(
        map(files.request.cat.success),
        catchError(map(files.request.cat.failure)),
      ),
    ),
  );

const watchCat: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.cat)),
    map(action => files.request.cat.request(action.payload)),
  );

const rm: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.cat.request)),
    switchMap(action =>
      from(api.rm(action.payload)).pipe(
        map(files.request.rm.success, files.ls),
        catchError(map(files.request.rm.failure)),
      ),
    ),
  );

const watchRm: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.rm)),
    map(action => files.request.rm.request(action.payload)),
  );

const touch: Epic<IpfsAction, IpfsAction, IpfsState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(files.request.touch.request)),
    switchMap(action =>
      from(api.touch(state$.value.files.root, action.payload.name, action.payload.content)).pipe(
        map(files.request.rm.success, files.ls),
        catchError(map(files.request.rm.failure)),
      ),
    ),
  );

const watchTouch: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.touch)),
    map(action => files.request.touch.request(action.payload)),
  );

const mkdir: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.cat.request)),
    switchMap(action =>
      from(api.mkdir(action.payload)).pipe(
        map(files.request.mkdir.success, files.ls),
        catchError(map(files.request.mkdir.failure)),
      ),
    ),
  );

const watchMkdir: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.mkdir)),
    map(action => files.request.mkdir.request(action.payload)),
  );

const rmdir: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.request.cat.request)),
    switchMap(action =>
      from(api.rm(action.payload)).pipe(
        map(files.request.rmdir.success, files.ls),
        catchError(map(files.request.rmdir.failure)),
      ),
    ),
  );

const watchRmdir: Epic<IpfsAction, IpfsAction, IpfsState> = action$ =>
  action$.pipe(
    filter(isActionOf(files.rmdir)),
    map(action => files.request.rmdir.request(action.payload)),
  );

export default [watchLs, watchCat, watchRm, watchTouch, watchMkdir, watchRmdir];
