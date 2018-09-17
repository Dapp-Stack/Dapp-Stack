export interface IStorageStrategy {
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
}
