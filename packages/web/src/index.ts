import {
  build as buildEnv,
  WebFramework,
  WebDeploy,
  Maybe
} from '@dapp-stack/environment'
import { Signale } from 'signale'

import { IWebFrameworkStrategy, IWebDeployStrategy } from './types'
import { Null } from './null'
import { CreateReactApp } from './strategies/createReactApp'
import { Angular } from './strategies/angular'
import { Next } from './strategies/next'
import { Vue } from './strategies/vue'
import { Ipfs } from './strategies/ipfs'

const signale = new Signale({ scope: 'Web' })

const frameworkStrategy = (
  strategy: Maybe<WebFramework>
): IWebFrameworkStrategy => {
  const framework = strategy || buildEnv().web.framework
  if (!framework) return new Null()

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
      return new Null()
  }
}

const deployStrategy = (strategy: Maybe<WebDeploy>): IWebDeployStrategy => {
  const deploy = strategy || buildEnv().web.deploy
  if (!deploy) return new Null()

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
  return deployStrategy(strategy).deploy()
}
