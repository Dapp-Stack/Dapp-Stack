import * as security from '@dapp-stack/security'

import { globalError } from './shared/globalError'

security
  .run()
  .then()
  .catch(globalError)
