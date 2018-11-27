export interface IWebFrameworkStrategy {
  start(): void
  build(): Promise<void>
  stop(): void
}

export interface IWebDeployStrategy {
  deploy(): Promise<void>
}
