import chalk from 'chalk';
import * as path from 'path';
import * as semver from 'semver';

export default function guardNodeVersion(packageName: string): void {
  const packageJsonPath = path.resolve(process.cwd(), 'node_modules', packageName, 'package.json');
  const packageJson = require(packageJsonPath);
  if (!packageJson.engines || !packageJson.engines.node) {
    return;
  }

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(
      chalk.red(
        'You are running Node %s.\n' +
          'Create React App requires Node %s or higher. \n' +
          'Please update your version of Node.',
      ),
      process.version,
      packageJson.engines.node,
    );
    process.exit(1);
  }
}
