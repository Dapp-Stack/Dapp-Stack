export interface IEtherereumStrategy {
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
}

export type GanacheEtherereum = {
  personal_accounts: {
    [publicKey: string]: number;
  };
};
