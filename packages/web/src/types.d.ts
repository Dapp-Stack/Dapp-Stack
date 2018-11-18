export interface IWebFrameworkStrategy {
  start(): void;
  build(): Promise<void>;
  test(): void;
  eject(): void;
  stop(): void;
}

export interface IWebDeployStrategy {
  deploy(): Promise<void>;
}
