import chalk from 'chalk';

export default {
  error(...args: any[]): void {
    console.error(chalk.red(...args)); // tslint:disable-line:no-console
  },
};