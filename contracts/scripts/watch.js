const chokidar = require('chokidar');

const { compile } = require('../lib/compiler');
const config = require("../config");

let watcher = chokidar.watch(`../src/**/*.sol`, { cwd: __dirname, ignoreInitial: true });

const compileSingle = function(name) {
  let contractName = config.contracts.find(c => c === name);
  return compile(contractName);
};

const compileAndDeploy = function(path) {
  compileSingle(path.replace("../src/", ""));
  config[process.env.SOLON_ENV]();
};

watcher.on('add', path => compileAndDeploy(path));
watcher.on('change', path => compileAndDeploy(path));
