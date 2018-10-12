"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spawn = require("cross-spawn");
var path = require("path");
var reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
var React = /** @class */ (function () {
    function React(signale) {
        var _this = this;
        this.start = function () {
            _this.signale.await('Starting react-scripts...');
            _this.child = spawn('node', [reactScriptsPath, 'start'], { stdio: 'pipe' });
            _this.child.stdout.on('data', function (data) {
                data
                    .toString('utf-8')
                    .trim()
                    .split('\n')
                    .forEach(function (line) { return _this.signale.info(line); });
            });
        };
        this.build = function () {
            _this.signale.await('Building react-scripts...');
            _this.child = spawn('node', [reactScriptsPath, 'build'], { stdio: 'pipe' });
            _this.child.stdout.on('data', function (data) {
                data
                    .toString('utf-8')
                    .trim()
                    .split('\n')
                    .forEach(function (line) { return _this.signale.info(line); });
            });
            return new Promise(function (resolve) {
                _this.child.on('exit', function () {
                    resolve();
                });
            });
        };
        this.eject = function () {
            spawn.sync('node', [reactScriptsPath, 'eject'], { stdio: [process.stdin, process.stdout, process.stderr] });
        };
        this.test = function () {
            spawn.sync('node', [reactScriptsPath, 'test', '--env=jsdom'], {
                stdio: [process.stdin, process.stdout, process.stderr],
            });
        };
        this.stop = function () {
            _this.child && _this.child.kill();
        };
        this.signale = signale;
    }
    return React;
}());
exports.React = React;
//# sourceMappingURL=react.js.map