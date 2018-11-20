const GET_TRACKER = 'DAPP_STACK/GET_TRACKER';
const GET_TRACKER_SUCCESS = 'DAPP_STACK/GET_TRACKER/SUCCESS';
const GET_TRACKER_FAILURE = 'DAPP_STACK/GET_TRACKER/FAILURE';

function getTracker() {
  return { type: GET_TRACKER };
}

function getTrackerSuccess(tracker) {
  return { type: GET_TRACKER_SUCCESS, tracker };
}

function getTrackerFailure(error) {
  return { type: GET_TRACKER_FAILURE, error };
}

export function trackerReducer(state = {}, action) {
  switch (action.type) {
    case GET_TRACKER: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case GET_TRACKER_SUCCESS: {
      return {
        data: action.tracker.data,
        loading: false,
        error: null
      };
    }
    case GET_TRACKER_FAILURE: {
      return {
        data: null,
        loading: false,
        error: action.error
      };
    }
    default: {
      return state;
    }
  }
}

export const actions = {
  getTracker,
  getTrackerSuccess,
  getTrackerFailure
};

export const actionTypes = {
  GET_TRACKER,
  GET_TRACKER_SUCCESS,
  GET_TRACKER_FAILURE
};