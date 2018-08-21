"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var forge_1 = require("./forge");
var Migrations = require("../../setup/truffle/build/contracts/Migrations.json");
var dummyReducer_1 = require("./dummyReducer");
var Web3 = require("web3");
var store;
var _web3;
var getWeb3 = new Promise(function (ok, ko) {
    try {
        _web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));
        ok(_web3);
    }
    catch (e) {
        ko(e);
    }
});
describe("forge", function () {
    describe("Normal State", function () {
        test("Instanciate with Normal State", function () {
            store = forge_1.forge({
                type: 'truffle',
                truffle_contracts: [Migrations],
                preloaded_contracts: ["Migrations"]
            });
            var state = store.getState();
            expect(state.web3.status).toBe("LOADING");
        });
        test("Load dummy web3", function (done) {
            store.subscribe(function () {
                if (store.getState().web3 && store.getState().web3._)
                    done();
            });
            store.dispatch({
                type: 'LOAD_WEB3',
                loader: getWeb3,
                networks: []
            });
        }, 10000);
    });
    describe("Extended State", function () {
        test("Instanciate with extended State and custom Reducers", function () {
            var dummyreducer = function (state, action) {
                if (state === void 0) { state = 0; }
                return state;
            };
            var reducermap = __assign({}, dummyReducer_1.dummyReducer, { testStateProperty: dummyreducer });
            store = forge_1.forge({
                type: "truffle",
                contracts: [Migrations],
                preloaded_contracts: ["Migrations"]
            }, {
                reducer: reducermap,
                custom_state: { testStateProperty: 23 }
            });
            var state = store.getState();
            expect(state.testStateProperty).toBe(23);
        });
        test("Load dummy web3", function (done) {
            store.subscribe(function () {
                if (store.getState().web3 && store.getState().web3._)
                    done();
            });
            store.dispatch({
                type: 'LOAD_WEB3',
                loader: getWeb3,
                networks: []
            });
        }, 10000);
    });
});
//# sourceMappingURL=forge.test.js.map