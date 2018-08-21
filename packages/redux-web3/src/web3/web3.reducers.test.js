"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_actions_1 = require("./web3.actions");
var web3_reducers_1 = require("./web3.reducers");
var state = undefined;
describe("Web3 Reducers", function () {
    test("Web3Load", function () {
        state = web3_reducers_1.web3(state, web3_actions_1.Web3Load(new Promise(function (ok, ko) { }), []));
        expect(state.status).toBe('LOADING');
    });
    test("Web3Loaded", function () {
        state = web3_reducers_1.web3(state, web3_actions_1.Web3Loaded({ test: 1234 }, 4321, "0xabcd"));
        expect(state._.test).toBe(1234);
        expect(state.network_id).toBe(4321);
        expect(state.status).toBe('LOADED');
        expect(state.coinbase).toBe("0xabcd");
    });
    test("Web3LoadError", function () {
        state = web3_reducers_1.web3(state, web3_actions_1.Web3LoadError(new Error("TEST")));
        expect(state.error.message).toBe("TEST");
        expect(state.status).toBe("LOAD_ERROR");
    });
    test("Web3NetworkError", function () {
        state = web3_reducers_1.web3(state, web3_actions_1.Web3NetworkError(345));
        expect(state.network_id).toBe(345);
        expect(state.status).toBe("NETWORK_ERROR");
    });
    test("Web3Locked", function () {
        state = web3_reducers_1.web3(state, web3_actions_1.Web3Locked());
        expect(state.status).toBe("LOCKED");
    });
});
//# sourceMappingURL=web3.reducers.test.js.map