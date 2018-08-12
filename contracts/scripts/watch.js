const chokidar = require('chokidar');
const { compileSingle } = require('./compile');

let watcher = chokidar.watch(`../src/**/*.sol`, { cwd: __dirname, ignoreInitial: true });

const compileAndDeploy = function(path) {
  compileSingle(path.replace("../src/", ""));
};

watcher.on('add', path => compileAndDeploy(path));
watcher.on('change', path => compileAndDeploy(path));
