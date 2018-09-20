import { actionTypes } from './actions';

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FOO:
      return state;
    case actionTypes.BAR:
      return state;
    default:
      return state;
  }
};
