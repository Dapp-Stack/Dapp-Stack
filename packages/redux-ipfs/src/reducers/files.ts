import { getType } from 'typesafe-actions';
import { includes, reject, union } from 'lodash';
import { files, FilesAction } from '../actions';
import { File } from '../types';

type State = {
  root: string;
  list: File[];
}

const defaultState: State = {
  list: [],
  root: '/',
};

export default function(state: State = defaultState, action: FilesAction) {
  switch (action.type) {
    case getType(files.request.ls.success):
      return {
        ...state,
        ...{ list: action.payload }
      };
    default:
      return state;
  }
}
