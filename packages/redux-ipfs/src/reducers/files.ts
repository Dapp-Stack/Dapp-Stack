import { includes, reject, union } from 'lodash';
import { getType } from 'typesafe-actions';

import { files, FilesAction } from '../actions';
import { File } from '../types';

type State = {
  root: string;
  list: File[];
  content: string;
};

const defaultState: State = {
  list: [],
  root: '/',
  content: '',
};

export default function(state: State = defaultState, action: FilesAction) {
  switch (action.type) {
    case getType(files.cwd):
      return {
        ...state,
        ...{ root: action.payload },
      };
    case getType(files.request.ls.success):
      return {
        ...state,
        ...{ list: action.payload },
      };
    case getType(files.request.cat.success):
      return {
        ...state,
        ...{ content: action.payload },
      };
    default:
      return state;
  }
}
