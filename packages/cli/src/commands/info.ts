import chalk from 'chalk';
import { run } from 'envinfo';

export default function help(): void {
  console.log(chalk.bold('\nEnvironment Info:'));
  run(
    {
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'npm', 'Yarn'],
      Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
      npmPackages: ['react', 'react-dom', 'solon-scripts'],
      npmGlobalPackages: ['solon'],
    },
    {
      clipboard: true,
      duplicates: true,
      showNotFound: true,
    },
  )
    .then(console.log)
    .then(() => console.log(chalk.green('Copied To Clipboard!\n')));
}
