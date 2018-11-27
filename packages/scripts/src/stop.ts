import * as lifecycle from './shared/lifecycle'
import { globalError } from './shared/globalError'

lifecycle
  .stopAsync({ shouldExit: true })
  .then()
  .catch(globalError)
