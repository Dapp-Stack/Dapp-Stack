#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.on('unhandledRejection', function (err) {
    throw err;
});
var spawn = require("cross-spawn");
var args = process.argv.slice(2);
var commandIndex = args.findIndex(function (x) { return x === 'build' || x === 'start' || x === 'test'; });
var command = commandIndex === -1 ? args[0] : args[commandIndex];
var nodeArgs = commandIndex > 0 ? args.slice(0, commandIndex) : [];
switch (command) {
    case 'build':
    case 'start':
    case 'test': {
        var result = spawn.sync('node', nodeArgs.concat(require.resolve('./commands/' + command)).concat(args.slice(commandIndex + 1)), { stdio: 'inherit' });
        if (result.signal) {
            if (result.signal === 'SIGKILL') {
                console.log('The build failed because the process exited too early. ' +
                    'This probably means the system ran out of memory or someone called ' +
                    '`kill -9` on the process.');
            }
            else if (result.signal === 'SIGTERM') {
                console.log('The build failed because the process exited too early. ' +
                    'Someone might have called `kill` or `killall`, or the system could ' +
                    'be shutting down.');
            }
            process.exit(1);
        }
        process.exit(result.status);
        break;
    }
    default:
        console.log('Unknown command "' + command + '".');
        console.log('Perhaps you need to update solon-scripts?');
        break;
}
//# sourceMappingURL=index.js.map