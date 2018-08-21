"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
var contracts_actions_1 = require("./contracts.actions");
var contracts_reducers_1 = require("./contracts.reducers");
var contractName = "Ballot";
var contractAddress = "0xabcde";
var contractMethod = "owner";
var contractInstance = {
    methods: (_a = {},
        _a[contractMethod] = {},
        _a),
    test: 'TEST'
};
var state = (_b = {},
    _b[contractName] = {
        artifact: {}
    },
    _b);
describe("Contracts Reducers", function () {
    test("ContractLoading", function () {
        state = contracts_reducers_1.contracts(state, contracts_actions_1.ContractLoading(contractName, contractAddress));
        expect(state[contractName][contractAddress].status).toBe('LOADING');
    });
    test("ContractLoaded", function () {
        state = contracts_reducers_1.contracts(state, contracts_actions_1.ContractLoaded(contractName, contractAddress, contractInstance));
        expect(state[contractName][contractAddress].status).toBe('LOADED');
    });
    test("ContractError", function () {
        var _a, _b;
        state = contracts_reducers_1.contracts(state, contracts_actions_1.ContractError(contractName, contractAddress, contractInstance));
        state[contractName][contractAddress].instance = {
            vortexMethods: (_a = {},
                _a[contractMethod] = {
                    cache: (_b = {},
                        _b[contractMethod] = {
                            synced: false
                        },
                        _b)
                },
                _a)
        };
        expect(state[contractName][contractAddress].status).toBe('ERROR');
    });
    test("ContractVarReceived", function () {
        state = contracts_reducers_1.contracts(state, contracts_actions_1.ContractVarReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance));
        expect(state[contractName][contractAddress].instance.vortexMethods[contractMethod].cache[contractMethod].data.test).toBe('TEST');
    });
    test("ContractVarErrorReceived", function () {
        state = contracts_reducers_1.contracts(state, contracts_actions_1.ContractVarErrorReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance));
        expect(state[contractName][contractAddress].instance.vortexMethods[contractMethod].cache[contractMethod].error.test).toBe('TEST');
    });
});
//# sourceMappingURL=contracts.reducers.test.js.map