import { getType } from 'typesafe-actions';

import { config, ConfigAction } from '../actions';
import { Config } from '../types';

const defaultConfig: Config = {
  host: '',
  port: '',
  protocol: '',
};

export default (state: Config = defaultConfig, action: ConfigAction) => {
  switch (action.type) {
    case getType(config.request.load.success):
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
