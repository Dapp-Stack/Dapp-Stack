import { ActionType } from 'typesafe-actions';

import * as accounts from './accounts';
import * as init from './init';

export type InitAction = ActionType<typeof init>;
export type AccountsAction = ActionType<typeof accounts>;

export type Web3Action = InitAction | AccountsAction;

export { init, accounts };
