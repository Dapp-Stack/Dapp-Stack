import { IIpfsStrategy } from '../types'

export class Null implements IIpfsStrategy {
  start = () => {
    return new Promise<boolean>(resolve => resolve(true))
  }

  stop = () => {
    return new Promise<boolean>(resolve => resolve(true))
  }
}
