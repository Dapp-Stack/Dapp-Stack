import { ActionType, getType } from 'typesafe-actions';
import { config } from '../actions';
import { Config } from '../types';

type ConfigAction = ActionType<typeof config>;

const defaultConfig: Config = {
  host: '',
  port: '',
  protocol: '',
};

export default (state: Config = defaultConfig, action: ConfigAction) => {
  switch (action.type) {
    case getType(config.load.success):
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
