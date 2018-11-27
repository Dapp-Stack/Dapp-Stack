export interface IIpfsStrategy {
  start(): Promise<boolean>
  stop(): Promise<boolean>
}
