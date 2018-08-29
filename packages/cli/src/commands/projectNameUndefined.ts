import chalk from 'chalk';

export default function projectNameUndefined(name: string): void {
  console.error('Please specify the project directory:');
  console.log(`  ${chalk.cyan(name)} ${chalk.green('<project-directory>')}`);
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(name)} ${chalk.green('my-solon-app')}`);
  console.log();
  console.log(`Run ${chalk.cyan(`${name} --help`)} to see all options.`);
}
