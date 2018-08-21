"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_actions_1 = require("./contracts.actions");
var contractName = "Ballot";
var contractAddress = "0xabcde";
var contractMethod = "owner";
var contractInstance = { test: 'TEST' };
var transactionArgs = { from: contractAddress };
describe("Contracts Actions", function () {
    test("ContractLoading", function () {
        var ret = contracts_actions_1.ContractLoading(contractName, contractAddress);
        expect(ret.type).toBe('CONTRACT_LOADING');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
    });
    test("ContractLoaded", function () {
        var ret = contracts_actions_1.ContractLoaded(contractName, contractAddress, contractInstance);
        expect(ret.type).toBe('CONTRACT_LOADED');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.contractInstance.test).toBe('TEST');
    });
    test("ContractError", function () {
        var ret = contracts_actions_1.ContractError(contractName, contractAddress, contractInstance);
        expect(ret.type).toBe('CONTRACT_ERROR');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.error.test).toBe('TEST');
    });
    test("ContractSend", function () {
        var ret = contracts_actions_1.ContractSend(contractName, contractAddress, contractMethod, transactionArgs, contractInstance, 1, "2", [3]);
        expect(ret.type).toBe('CONTRACT_SEND');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.transactionArgs.from).toBe(transactionArgs.from);
        expect(ret.resolvers.test).toBe('TEST');
        expect(ret.methodArgs[0]).toBe(1);
        expect(ret.methodArgs[1]).toBe("2");
        expect(ret.methodArgs[2][0]).toBe(3);
    });
    test("ContractCall", function () {
        var ret = contracts_actions_1.ContractCall(contractName, contractAddress, contractMethod, transactionArgs, contractInstance, 1, "2", [3]);
        expect(ret.type).toBe('CONTRACT_CALL');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.transactionArgs.from).toBe(transactionArgs.from);
        expect(ret.resolvers.test).toBe('TEST');
        expect(ret.methodArgs[0]).toBe(1);
        expect(ret.methodArgs[1]).toBe("2");
        expect(ret.methodArgs[2][0]).toBe(3);
    });
    test("ContractVarReceived", function () {
        var ret = contracts_actions_1.ContractVarReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance);
        expect(ret.type).toBe('CONTRACT_VAR_RECEIVED');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.methodHash).toBe(contractMethod);
        expect(ret.result.test).toBe('TEST');
    });
    test("ContractVarErrorReceived", function () {
        var ret = contracts_actions_1.ContractVarErrorReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance);
        expect(ret.type).toBe('CONTRACT_VAR_ERROR_RECEIVED');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.methodHash).toBe(contractMethod);
        expect(ret.error.test).toBe('TEST');
    });
    test("ContractVarForceRefresh", function () {
        var ret = contracts_actions_1.ContractVarForceRefresh(contractName, contractAddress, contractMethod, contractMethod);
        expect(ret.type).toBe('CONTRACT_VAR_FORCE_REFRESH');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.methodHash).toBe(contractMethod);
    });
    test("ContractLoad", function () {
        var ret = contracts_actions_1.ContractLoad(contractName, contractAddress);
        expect(ret.type).toBe('CONTRACT_LOAD');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
    });
});
//# sourceMappingURL=contracts.actions.test.js.map