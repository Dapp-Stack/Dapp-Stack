"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ContractLoading(contractName, contractAddress) {
    return {
        type: 'CONTRACT_LOADING',
        contractName: contractName,
        contractAddress: contractAddress
    };
}
exports.ContractLoading = ContractLoading;
function ContractLoaded(contractName, contractAddress, contractInstance) {
    return {
        type: 'CONTRACT_LOADED',
        contractName: contractName,
        contractAddress: contractAddress,
        contractInstance: contractInstance
    };
}
exports.ContractLoaded = ContractLoaded;
function ContractError(contractName, contractAddress, error) {
    return {
        type: 'CONTRACT_ERROR',
        contractName: contractName,
        contractAddress: contractAddress,
        error: error
    };
}
exports.ContractError = ContractError;
function ContractSend(contractName, contractAddress, methodName, transactionArgs, resolvers) {
    var methodArgs = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        methodArgs[_i - 5] = arguments[_i];
    }
    return {
        type: 'CONTRACT_SEND',
        contractName: contractName,
        contractAddress: contractAddress,
        methodName: methodName,
        transactionArgs: transactionArgs,
        resolvers: resolvers,
        methodArgs: methodArgs,
    };
}
exports.ContractSend = ContractSend;
function ContractCall(contractName, contractAddress, methodName, transactionArgs, resolvers) {
    var methodArgs = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        methodArgs[_i - 5] = arguments[_i];
    }
    return {
        type: 'CONTRACT_CALL',
        contractName: contractName,
        contractAddress: contractAddress,
        methodName: methodName,
        transactionArgs: transactionArgs,
        resolvers: resolvers,
        methodArgs: methodArgs
    };
}
exports.ContractCall = ContractCall;
function ContractVarReceived(contractName, contractAddress, methodName, methodHash, result) {
    return {
        type: 'CONTRACT_VAR_RECEIVED',
        contractName: contractName,
        contractAddress: contractAddress,
        methodName: methodName,
        methodHash: methodHash,
        result: result
    };
}
exports.ContractVarReceived = ContractVarReceived;
function ContractVarErrorReceived(contractName, contractAddress, methodName, methodHash, error) {
    return {
        type: 'CONTRACT_VAR_ERROR_RECEIVED',
        contractName: contractName,
        contractAddress: contractAddress,
        methodName: methodName,
        methodHash: methodHash,
        error: error
    };
}
exports.ContractVarErrorReceived = ContractVarErrorReceived;
function ContractVarForceRefresh(contractName, contractAddress, methodName, methodHash) {
    return {
        type: 'CONTRACT_VAR_FORCE_REFRESH',
        contractName: contractName,
        contractAddress: contractAddress,
        methodName: methodName,
        methodHash: methodHash
    };
}
exports.ContractVarForceRefresh = ContractVarForceRefresh;
function ContractLoad(contractName, contractAddress) {
    return {
        type: 'CONTRACT_LOAD',
        contractName: contractName,
        contractAddress: contractAddress
    };
}
exports.ContractLoad = ContractLoad;
function ContractPreloadDone(recap) {
    return {
        type: 'CONTRACT_PRELOAD_DONE',
        recap: recap
    };
}
exports.ContractPreloadDone = ContractPreloadDone;
function ContractCompleteRefresh(contract_name, contract_address) {
    return {
        type: 'CONTRACT_COMPLETE_REFRESH',
        contract_name: contract_name,
        contract_address: contract_address
    };
}
exports.ContractCompleteRefresh = ContractCompleteRefresh;
function ContractSetDeployed(contract_name, contract_address) {
    return {
        type: 'CONTRACT_SET_DEPLOYED',
        contract_name: contract_name,
        contract_address: contract_address
    };
}
exports.ContractSetDeployed = ContractSetDeployed;
//# sourceMappingURL=contracts.actions.js.map