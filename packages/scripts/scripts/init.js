"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var spawn = require("cross-spawn");
var os_1 = require("os");
function installDependencies(useYarn, verbose) {
    var command;
    var args;
    if (useYarn) {
        command = 'yarnpkg';
        args = ['add'];
    }
    else {
        command = 'npm';
        args = ['install', '--save'];
        if (verbose) {
            args.push('--verbose');
        }
    }
    args.push('web3', 'solium');
    console.log("Installing web3 and solium using " + command + "...");
    console.log();
    var proc = spawn.sync(command, args, { stdio: 'inherit' });
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
    var templatePath = path.join(ownPath, 'template');
    fs.copySync(templatePath, appPath);
}
function init(appPath, appName, verbose, originalDirectory, template) {
    var useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
    var scriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'init.js');
    var init = require(scriptsPath);
    init(appPath, appName, verbose, originalDirectory, template);
    installDependencies(useYarn, verbose);
    updatePackage(appPath);
    installTemplate(appPath);
}
;
module.exports = init;
//# sourceMappingURL=init.js.map