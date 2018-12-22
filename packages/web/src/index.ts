import {
  build as buildEnv,
  WebFramework,
  WebDeploy,
  Maybe
} from '@dapp-stack/environment'
import { Signale } from 'signale'

import { Null } from './null'
import { Web } from './web/web'
import { CreateReactApp } from './web/createReactApp'
import { Angular } from './web/angular'
import { Next } from './web/next'
import { Vue } from './web/vue'
import { Deploy } from './deploy/deploy'
import { Ipfs } from './deploy/ipfs'

const signale = new Signale({ scope: 'Web' })

const frameworkStrategy = (strategy: Maybe<WebFramework>): Web => {
  const framework = strategy || buildEnv().web.framework
  if (!framework) return new Null(signale)

  switch (framework) {
    case 'create-react-app':
      return new CreateReactApp(signale)
    case 'vue':
      return new Vue(signale)
    case 'angular':
      return new Angular(signale)
    case 'next':
      return new Next(signale)
    default:
      return new Null(signale)
  }
}

const deployStrategy = (strategy: Maybe<WebDeploy>): Deploy => {
  const deploy = strategy || buildEnv().web.deploy
  if (!deploy) return new Null(signale)

  switch (deploy) {
    case 'ipfs':
      return new Ipfs(signale)
  }
}

export const start = (strategy: Maybe<WebFramework> = false) => {
  frameworkStrategy(strategy).start()
}

export const build = (strategy: Maybe<WebFramework> = false) => {
  return frameworkStrategy(strategy).build()
}

export const stop = (strategy: Maybe<WebFramework> = false) => {
  frameworkStrategy(strategy).stop()
}

export const deploy = (strategy: Maybe<WebDeploy> = false) => {
  return deployStrategy(strategy).run()
}
