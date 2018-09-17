export interface IBlockchainStrategy {
  start(): Promise<boolean>
  stop(): Promise<boolean>
}