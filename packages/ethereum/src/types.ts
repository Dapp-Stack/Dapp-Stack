export interface IEthereumStrategy {
  start(): Promise<boolean>
  stop(): Promise<boolean>
}

export type GanacheEthereum = {
  personal_accounts: {
    [publicKey: string]: number
  }
}
