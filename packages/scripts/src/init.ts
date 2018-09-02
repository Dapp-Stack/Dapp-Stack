import * as fs from 'fs-extra';
import * as path from 'path';
import * as spawn from 'cross-spawn'
import { Signale } from 'signale';

import { EOL } from 'os';

let log = console.log;

function mute() {
  console.log = function() {};
}

function unmute() {
  console.log = log;
}

function installDependencies(useYarn: boolean, verbose: boolean) {
  let command;
  let args: string[];

  if (useYarn) {
    command = 'yarnpkg';
    args = ['add'];
  } else {
    command = 'npm';
    args = ['install', '--save'];
    if(verbose) {
      args.push('--verbose')
    }
  }
  
  args.push('web3', 'solium');

  const proc = spawn.sync(command, args, { stdio: 'ignore' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(1);
  }
}

function updatePackage(appPath: string) {
  const appPackage = require(path.join(appPath, 'package.json'));
  appPackage.dependencies = appPackage.dependencies || {};

  appPackage.scripts = {
    start: 'solon-scripts start',
    build: 'solon-scripts build',
    deploy: 'solon-scripts deploy',
    clean: 'solon-scripts clean',
    lint: 'solon-scripts lint',
    eject: 'solon-script eject',
    test: 'solon-scripts test --env=jsdom',
  };

  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + EOL);
}
  

function installTemplate(appPath: string){
  const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const templatePath = path.join(ownPath, 'template');
  fs.copySync(templatePath, appPath);
}

function initReactScripts(appPath: string, appName: string, verbose: boolean, originalDirectory: string, template: string) {
  const reactScripts = new Signale({interactive: true, scope: 'React Scripts'});
  const scriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'init.js');
  const init = require(scriptsPath);
  mute();
  init(appPath, appName, verbose, originalDirectory, template);
  unmute();
}

function initSolonScripts(appPath: string, verbose: boolean) {
  const solonScripts = new Signale({interactive: true, scope: 'Solon Scripts'});
  solonScripts.await('[%d/2] - Installing...', 1);

  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
  installDependencies(useYarn, verbose);
  updatePackage(appPath);
  installTemplate(appPath);
  solonScripts.success('[%d/2] - Success', 2);
}

function init(appPath: string, appName: string, verbose: boolean, originalDirectory: string, template: string) {
  initReactScripts(appPath, appName, verbose, originalDirectory, template);
  initSolonScripts(appPath, verbose);  
};

module.exports = init;