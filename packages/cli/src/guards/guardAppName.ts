import chalk from 'chalk';
import * as validateNpmPackageName from 'validate-npm-package-name';

import logger from '../logger';

function printValidationResults(results: string[]) {
  if (typeof results !== 'undefined') {
    results.forEach((error: string) => logger.error(`  *  ${error}`));
  }
}

export default function guardAppName(appName: string): void {
  const validationResult = validateNpmPackageName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(`Could not create a project called ${chalk.red(`"${appName}"`)} because of npm naming restrictions:`);
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  const dependencies = ['react', 'react-dom', 'solon-scripts'].sort();
  if (dependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(appName)} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`,
      ) +
        chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
        chalk.red('\n\nPlease choose a different project name.'),
    );
    process.exit(1);
  }
}
