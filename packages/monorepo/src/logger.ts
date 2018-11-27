import chalk from 'chalk'

export const logger = {
  info(...args: any[]): void {
    console.log(...args) // tslint:disable-line:no-console
  },
  bold(...args: any[]): void {
    console.log(chalk.bold(...args)) // tslint:disable-line:no-console
  },
  error(...args: any[]): void {
    console.error(chalk.red(...args)) // tslint:disable-line:no-console
  }
}
