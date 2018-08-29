import chalk from 'chalk';
import * as spawn from 'cross-spawn';

export default function installDependencies(
  root: string,
  isYarn: boolean,
  dependencies: string[],
  verbose: boolean,
  isOnline: boolean,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];
    if (isYarn) {
      command = 'yarnpkg';
      args = ['add', '--exact'];
      if (!isOnline) {
        args.push('--offline');
      }
      [].push.apply(args, dependencies);

      args.push('--cwd');
      args.push(root);

      if (!isOnline) {
        console.log(chalk.yellow('You appear to be offline.'));
        console.log(chalk.yellow('Falling back to the local Yarn cache.'));
        console.log();
      }
    } else {
      command = 'npm';
      args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
    }

    if (verbose) {
      args.push('--verbose');
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', (code: number) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve(true);
    });
  });
}
