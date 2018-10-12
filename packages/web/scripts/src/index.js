"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("@solon/environment");
var signale_1 = require("signale");
var null_1 = require("./strategies/null");
var react_1 = require("./strategies/react");
var signale = new signale_1.Signale({ scope: 'Web' });
var strategy = function () {
    var web = environment_1.build().services.web;
    if (!web)
        return new null_1.Null();
    switch (web) {
        case 'react':
            return new react_1.React(signale);
        // case 'vue':
        //   return new Vue(signale);
        // case 'angular':
        //   return new Angular(signale);
        default:
            return new null_1.Null();
    }
};
exports.start = function () {
    strategy().start();
};
exports.build = function () {
    strategy().build();
};
exports.test = function () {
    strategy().test();
};
exports.eject = function () {
    strategy().eject();
};
exports.stop = function () {
    strategy().stop();
};
//# sourceMappingURL=index.js.map