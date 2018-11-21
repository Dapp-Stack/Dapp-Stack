import { IEthereumStrategy } from '../types'

export class Null implements IEthereumStrategy {
  start = () => {
    return new Promise<boolean>(resolve => resolve(true))
  }

  stop = () => {
    return new Promise<boolean>(resolve => resolve(true))
  }
}
