import { ActionType } from 'typesafe-actions'

import * as provider from './provider'
import * as contracts from './contracts'

export type ProviderAction = ActionType<typeof provider>
export type ContractsAction = ActionType<typeof contracts>

export type EthAction = ProviderAction | ContractsAction

export { provider, contracts }
