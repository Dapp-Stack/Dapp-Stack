export interface IBlockchainStrategy {
  start(): Promise<boolean>
  stop(): Promise<boolean>
}

export type GanacheBlockchain = {
  personal_accounts: {
    [publicKey: string]: number;
  }
}