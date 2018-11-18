"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var download_1 = require("./download");
var error = function (error) {
    process.stdout.write(error + "\n");
    process.stdout.write('Download failed!\n\n');
    process.exit(1);
};
var success = function (output) {
    process.stdout.write("Downloaded " + output.filename + "\n");
    process.stdout.write("Installed geth to " + output.installPath + "\n");
    process.exit(0);
};
download_1.download()
    .then(success)
    .catch(error);
//# sourceMappingURL=index.js.map