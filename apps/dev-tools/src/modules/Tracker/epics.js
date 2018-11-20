import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { actionTypes, actions } from './index';
import { getTracker } from '../../services/dappStack';

const watchGetTracker = action$ =>
  action$.pipe(
    ofType(actionTypes.GET_TRACKER),
    switchMap(action =>
      from(getTracker()).pipe(
        map(actions.getTrackerSuccess),
        catchError(error => of(actions.getTrackerFailure(error))),
      ),
    ),
  );

export default [watchGetTracker];
