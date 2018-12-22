import * as child_process from 'child_process'
import { Signale } from 'signale'

export abstract class Web {
  protected child!: child_process.ChildProcess

  constructor(protected readonly signale: Signale) {}

  abstract start(): void
  abstract build(): Promise<void>

  public stop = () => {
    this.child && this.child.kill()
  }

  public onStderr = (data: Buffer) => {
    this.toArray(data).forEach(line => this.signale.error(line))
  }

  public onStdout = (data: Buffer) => {
    this.toArray(data).forEach(line => this.signale.info(line))
  }

  private toArray = (data: Buffer) => {
    return data
      .toString('utf-8')
      .trim()
      .split('\n')
  }
}
