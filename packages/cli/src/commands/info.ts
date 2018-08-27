import chalk from 'chalk';
import envinfo from 'envinfo';

export default function help(): void {
  console.log(chalk.bold('\nEnvironment Info:'));
  return envinfo.run(
    {
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'npm', 'Yarn'],
      Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
      npmPackages: ['solon-scripts'],
      npmGlobalPackages: ['solon-cli'],
    },
    {
      clipboard: true,
      duplicates: true,
      showNotFound: true,
    }
  )
  .then(console.log)
  .then(() => console.log(chalk.green('Copied To Clipboard!\n')));
}