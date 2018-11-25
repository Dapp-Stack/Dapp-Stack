import { build as buildEnv, WebFramework } from '@dapp-stack/environment'
import { Signale } from 'signale'

import { IWebFrameworkStrategy, IWebDeployStrategy } from './types'
import { Null } from './null'
import { React } from './strategies/react'
import { Ipfs } from './strategies/ipfs'

const signale = new Signale({ scope: 'Web' })

const frameworkStrategy = (strategy: Maybe<WebFramework>): IWebFrameworkStrategy => {
  const framework = strategy || buildEnv().web.framework
  if (!framework) return new Null()

  switch (framework) {
    case 'react':
      return new React(signale)
    // case 'vue':
    //   return new Vue(signale);
    // case 'angular':
    //   return new Angular(signale);
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

export const start = (strategy: Maybe<WebFramework> = null) => {
  frameworkStrategy(strategy).start()
}

export const build = (strategy: Maybe<WebFramework> = null) => {
  return frameworkStrategy(strategy).build()
}

export const stop = (strategy: Maybe<WebFramework> = null) => {
  frameworkStrategy(strategy).stop()
}

export const deploy = (strategy: Maybe<WebDeploy> = null) => {
  return deployStrategy(strategy).deploy()
}
