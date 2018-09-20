import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { actionTypes } from '../features/Explorer';

const authEpic = action$ => action$.ofType(actionTypes.FOO).switchMap(q => ({}));

export const rootEpic = combineEpics(authEpic);
