export interface IWebStrategy {
  start(): void;
  build(): Promise<void>;
  test(): void;
  eject(): void;
  stop(): void;
}