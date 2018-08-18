const chokidar = require('chokidar');

const { compile } = require('../lib/compiler');
const { generateDoc } = require('../lib/generateDoc');
const config = require("../config");

let watcher = chokidar.watch(`../src/**/*.sol`, { cwd: __dirname, ignoreInitial: true });

const compileDeployAndDocs = async function(path) {
  let contractName = path.replace("../src/", "")
  if (!config.contracts.find(value => value === contractName)) {
    return;
  }
  await compile(contractName);

  config[process.env.SOLON_ENV]();

  await generateDoc(contractName);
};

watcher.on('add', path => compileDeployAndDocs(path));
watcher.on('change', path => compileDeployAndDocs(path));

const initialize = async function() {
  let compilations = config.contracts.map((contractName) => compile(contractName));
  await Promise.all(compilations);

  config[process.env.SOLON_ENV]();

  let docs = config.contracts.map((contractName) => generateDoc(contractName));
  await Promise.all(docs);
};

initialize();
