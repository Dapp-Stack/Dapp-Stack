"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spawn = require("cross-spawn");
var fs = require("fs-extra");
var os_1 = require("os");
var path = require("path");
var signale_1 = require("signale");
var log = console.log;
function mute() {
    console.log = function () { };
}
function unmute() {
    console.log = log;
}
function installDependencies(isYarn) {
    var command;
    var args;
    if (isYarn) {
        command = 'yarnpkg';
        args = ['add'];
    }
    else {
        command = 'npm';
        args = ['install', '--save'];
    }
    args.push('web3', 'solium');
    var proc = spawn.sync(command, args, { stdio: 'ignore' });
    if (proc.status !== 0) {
        console.error("`" + command + " " + args.join(' ') + "` failed");
        process.exit(1);
    }
}
function updatePackage(appPath) {
    var appPackage = require(path.join(appPath, 'package.json'));
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
    fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + os_1.EOL);
}
function installTemplate(appPath) {
    var ownPackageName = require(path.join(__dirname, '..', 'package.json')).name;
    var ownPath = path.join(appPath, 'node_modules', ownPackageName);
    var templatePath = path.join(ownPath, '..', '..', 'template');
    fs.copySync(templatePath, appPath);
}
function initReactScripts(appPath, appName, verbose, originalDirectory, template) {
    var reactScripts = new signale_1.Signale({ interactive: true, scope: 'React Scripts' });
    var scriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'init.js');
    var init = require(scriptsPath);
    mute();
    init(appPath, appName, verbose, originalDirectory, template);
    unmute();
}
function initSolonScripts(appPath) {
    var solonScripts = new signale_1.Signale({ interactive: true, scope: 'Solon Scripts' });
    solonScripts.await('[%d/2] - Installing...', 1);
    var isYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
    installDependencies(isYarn);
    updatePackage(appPath);
    installTemplate(appPath);
    solonScripts.success('[%d/2] - Success', 2);
}
function init(appPath, appName, verbose, originalDirectory, template) {
    initReactScripts(appPath, appName, verbose, originalDirectory, template);
    initSolonScripts(appPath);
}
module.exports = init;
//# sourceMappingURL=init.js.map