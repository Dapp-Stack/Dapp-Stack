import { IWebFrameworkStrategy, IWebDeployStrategy } from './types'

export class Null implements IWebFrameworkStrategy, IWebDeployStrategy {
  start = () => undefined

  build = () => {
    return new Promise<void>(resolve => resolve())
  }

  eject = () => undefined

  test = () => undefined

  stop = () => undefined

  deploy = () => {
    return new Promise<void>(resolve => resolve())
  }
}
