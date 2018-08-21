"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_actions_1 = require("./web3.actions");
describe("Web3 Actions", function () {
    test("Web3Load", function () {
        expect(web3_actions_1.Web3Load((new Promise(function (ok, ko) { })), []).type).toBe('LOAD_WEB3');
    });
    test("Web3Loaded", function () {
        var ret = web3_actions_1.Web3Loaded({ test: 123 }, 34, "0xabcd");
        expect(ret.networkId).toBe(34);
        expect(ret._.test).toBe(123);
        expect(ret.type).toBe('LOADED_WEB3');
        expect(ret.coinbase).toBe("0xabcd");
    });
    test("Web3LoadError", function () {
        var ret = web3_actions_1.Web3LoadError(new Error("TEST"));
        expect(ret.error.message).toBe("TEST");
        expect(ret.type).toBe('LOAD_ERROR_WEB3');
    });
    test("Web3NetworkError", function () {
        var ret = web3_actions_1.Web3NetworkError(1234);
        expect(ret.networkId).toBe(1234);
        expect(ret.type).toBe('NETWORK_ERROR_WEB3');
    });
    test("Web3Locked", function () {
        var ret = web3_actions_1.Web3Locked();
        expect(ret.type).toBe('LOCKED_WEB3');
    });
});
//# sourceMappingURL=web3.actions.test.js.map