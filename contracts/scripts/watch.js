const chokidar = require('chokidar');

const { compile } = require('../lib/compiler');
const config = require("../config");

let watcher = chokidar.watch(`../src/**/*.sol`, { cwd: __dirname, ignoreInitial: true });

const compileAndDeploy = async function(path) {
  let contractName = path.replace("../src/", "")
  if (!config.contracts.find(value => value === contractName)) {
    return;
  }
  await compile(contractName);
  config[process.env.SOLON_ENV]();
};

watcher.on('add', path => compileAndDeploy(path));
watcher.on('change', path => compileAndDeploy(path));

const initialize = async function() {
  let promises = config.contracts.map((contractName) => compile(contractName));
  await Promise.all(promises);
  config[process.env.SOLON_ENV]();
};

initialize();
