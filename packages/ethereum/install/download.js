"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var goenv = require("go-platform");
var gunzip = require("gunzip-maybe");
var path = require("path");
var request = require("request");
var tarFS = require("tar-fs");
var VERSION = '1.8.21-9dc5d1a9';
exports.download = function () {
    return new Promise(function (resolve, reject) {
        var platform = goenv.GOOS;
        var arch = goenv.GOARCH;
        var installPath = path.join(__dirname, '..', 'bin');
        var isWindows = platform === 'windows';
        fs.ensureDirSync(installPath);
        var extension = isWindows ? '.exe' : '.tar.gz';
        var folder = "geth-" + platform + "-" + arch + "-" + VERSION;
        var filename = "" + folder + extension;
        var url = "https://gethstore.blob.core.windows.net/builds/" + filename;
        var isEmpty = fs.readdirSync(installPath).length === 0;
        var done = function () { return resolve({ filename: filename, installPath: installPath }); };
        if (!isEmpty) {
            return new Promise(function (resolve) { return done(); });
        }
        var unpack = function (stream) {
            return stream.pipe(gunzip()).pipe(tarFS.extract(installPath).on('finish', function () {
                fs.moveSync(path.join(installPath, folder, 'geth'), path.join(installPath, 'geth'), { overwrite: true });
                done();
            }));
        };
        process.stdout.write("Downloading " + url + "\n");
        return request
            .get(url, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode !== 200) {
                reject(new Error(response.statusCode + " - " + response.body));
            }
        })
            .on('response', function (response) {
            if (response.statusCode !== 200) {
                return;
            }
            if (isWindows) {
                fs.moveSync(path.join(installPath, filename), path.join(installPath, 'geth.exe'), { overwrite: true });
                return done();
            }
            unpack(response);
        });
    });
};
//# sourceMappingURL=download.js.map