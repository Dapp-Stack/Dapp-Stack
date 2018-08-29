import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';

import guardAppName from '../guards/guardAppName';
import guardDir from '../guards/guardDir';
import guardNodeVersion from '../guards/guardNodeVersion';
import guardNpm from '../guards/guardNpm';
import guardNpmVersion from '../guards/guardNpmVersion';
import installDependencies from '../installDependencies';
import { getSolonScriptsPackageName, getSolonScriptsToInstall } from '../scriptsHelper';
import { checkIfOnline, isYarnAvailable } from '../utils';

function createPackageJson(root: string, appName: string): void {
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);
}

function makeCaretRange(dependencies: any, name: string) {
  const version = dependencies[name];

  if (typeof version === 'undefined') {
    console.error(chalk.red(`Missing ${name} dependency in package.json`));
    process.exit(1);
  }

  let patchedVersion = `^${version}`;

  if (!semver.validRange(patchedVersion)) {
    console.error(
      `Unable to patch ${name} dependency version because version ${chalk.red(version)} will become invalid ${chalk.red(
        patchedVersion,
      )}`,
    );
    patchedVersion = version;
  }

  dependencies[name] = patchedVersion;
}

function setCaretRangeForRuntimeDeps(packageName: string) {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packagePath);

  if (typeof packageJson.dependencies === 'undefined') {
    console.error(chalk.red('Missing dependencies in package.json'));
    process.exit(1);
  }

  const packageVersion = packageJson.dependencies[packageName];
  if (typeof packageVersion === 'undefined') {
    console.error(chalk.red(`Unable to find ${packageName} in package.json`));
    process.exit(1);
  }

  makeCaretRange(packageJson.dependencies, 'react');
  makeCaretRange(packageJson.dependencies, 'react-dom');

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + os.EOL);
}

function abort(reason: any, root: string, appName: string) {
  console.log();
  console.log('Aborting installation.');
  if (reason.command) {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`);
  } else {
    console.log(chalk.red('Unexpected error. Please report it as a bug:'));
    console.log(reason);
  }
  console.log();

  // On 'exit' we will delete these files from target directory.
  const knownGeneratedFiles = ['package.json', 'node_modules'];
  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach(file => {
    knownGeneratedFiles.forEach(fileToMatch => {
      // This remove all of knownGeneratedFiles.
      if (file === fileToMatch) {
        console.log(`Deleting generated file... ${chalk.cyan(file)}`);
        fs.removeSync(path.join(root, file));
      }
    });
  });
  const remainingFiles = fs.readdirSync(path.join(root));
  if (!remainingFiles.length) {
    // Delete target folder if empty
    console.log(`Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(path.resolve(root, '..'))}`);
    process.chdir(path.resolve(root, '..'));
    fs.removeSync(path.join(root));
  }
  console.log('Done.');
  process.exit(1);
}

export default function createApp(name: string, verbose: boolean, version: string, useNpm: boolean) {
  const root: string = path.resolve(name);
  const appName: string = path.basename(root);

  guardAppName(appName);
  fs.ensureDirSync(name);
  guardDir(root, name);

  console.log(`Creating a new Solon app in ${chalk.green(root)}.`);
  console.log();

  createPackageJson(root, appName);

  const isYarn = useNpm ? false : isYarnAvailable();
  const originalDirectory = process.cwd();
  process.chdir(root);
  guardNpm(isYarn);
  guardNpmVersion(isYarn);

  const solonScriptsToInstall = getSolonScriptsToInstall(version, originalDirectory);
  const allDependencies = ['react', 'react-dom', solonScriptsToInstall];

  console.log('Installing packages. This might take a couple of minutes.');
  getSolonScriptsPackageName(solonScriptsToInstall)
    .then(packageName => checkIfOnline(isYarn).then(isOnline => ({ isOnline, packageName })))
    .then(info => {
      const { isOnline, packageName } = info;
      console.log(`Installing ${chalk.cyan('react')}, ${chalk.cyan('react-dom')}, and ${chalk.cyan(packageName)}...`);
      console.log();

      return installDependencies(root, isYarn, allDependencies, verbose, isOnline).then(() => packageName);
    })
    .then(packageName => {
      guardNodeVersion(packageName);
      setCaretRangeForRuntimeDeps(packageName);

      const scriptsPath = path.resolve(process.cwd(), 'node_modules', packageName, 'scripts', 'init.js');
      const init = require(scriptsPath);
      init(root, appName, verbose, originalDirectory);
    })
    .catch(reason => abort(reason, root, appName));
}