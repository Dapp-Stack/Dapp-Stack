const chokidar = require('chokidar');
chokidar.watch(`../src/**/*.sol`, { cwd: __dirname }).on('all', (event, path) => {
  console.log(event, path);
});
