import { Deploy } from './deploy/deploy'
import { Web } from './web/web'

export class Null extends Web implements Deploy {
  start = () => undefined

  build = () => {
    return new Promise<void>(resolve => resolve())
  }

  run = () => {
    return new Promise<void>(resolve => resolve())
  }
}
