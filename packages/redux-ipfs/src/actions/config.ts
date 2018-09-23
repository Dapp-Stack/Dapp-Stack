import {action, createRequestTypes} from './utils'

export const requests = {
  CONFIG_LOAD: createRequestTypes('CONFIG_LOAD'),
  load: {
    request: () => action(requests.CONFIG_LOAD.REQUEST),
    success: (response) => action(requests.CONFIG_LOAD.SUCCESS, {response}),
    failure: (error) => action(requests.CONFIG_LOAD.FAILURE, {error})
  }
}