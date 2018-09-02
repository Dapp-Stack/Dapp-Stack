process.on('unhandledRejection', err => {
  throw err;
});

import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

import { tryGitInit } from '../init/vcs';
import { updatePackage } from '../init/package';
import { renameReadme } from '../init/readme';
import { createGitIgnore } from '../init/gitignore';
import { installDependencies } from '../init/dependencies';
import { installTemplate } from '../init/template';

function printSuccess(useYarn: boolean, appName: string, appPath: string, originalDirectory: string): void {
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  const displayedCommand = useYarn ? 'yarn' : 'npm';
  
  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  console.log();
  console.log('Happy hacking!');
}

export default function(appPath: string, appName: string, verbose: boolean, originalDirectory: string) {
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  updatePackage(appPath);
  renameReadme(appPath);
  installTemplate(appPath);
  createGitIgnore(appPath);
  installDependencies(useYarn, verbose);

  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  printSuccess(useYarn, appName, appPath, originalDirectory);
};
