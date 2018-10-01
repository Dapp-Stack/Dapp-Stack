import { ActionType } from 'typesafe-actions';

import * as config from './config';
import * as files from './files';

export type ConfigAction = ActionType<typeof config>;
export type FilesAction = ActionType<typeof files>;

export type IpfsAction = ConfigAction | FilesAction;

export { config, files };
