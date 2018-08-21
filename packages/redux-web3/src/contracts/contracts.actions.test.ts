import {
    ContractLoading,
    ContractLoaded,
    ContractError,
    ContractSend,
    ContractCall,
    ContractVarReceived,
    ContractVarErrorReceived,
    ContractVarForceRefresh, ContractLoad
} from "./contracts.actions";

declare let describe: any;
declare let test: any;
declare let expect: any;


let contractName: string = "Ballot";
let contractAddress: string = "0xabcde";
let contractMethod: string = "owner";
let contractInstance: any = {test: 'TEST'};
let transactionArgs: any = {from: contractAddress};

describe("Contracts Actions", (): void => {

    test("ContractLoading", (): void => {
        const ret = ContractLoading(contractName, contractAddress);
        expect(ret.type).toBe('CONTRACT_LOADING');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
    });

    test("ContractLoaded", (): void => {
        const ret = ContractLoaded(contractName, contractAddress, contractInstance);
        expect(ret.type).toBe('CONTRACT_LOADED');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.contractInstance.test).toBe('TEST');
    });

    test("ContractError", (): void => {
        const ret = ContractError(contractName, contractAddress, contractInstance);
        expect(ret.type).toBe('CONTRACT_ERROR');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.error.test).toBe('TEST');
    });

    test("ContractSend", (): void => {
        const ret = ContractSend(contractName, contractAddress, contractMethod, transactionArgs, contractInstance, 1, "2", [3]);
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

    test("ContractCall", (): void => {
        const ret = ContractCall(contractName, contractAddress, contractMethod, transactionArgs, contractInstance, 1, "2", [3]);
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

    test("ContractVarReceived", (): void => {
        const ret = ContractVarReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance);
        expect(ret.type).toBe('CONTRACT_VAR_RECEIVED');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.methodHash).toBe(contractMethod);
        expect(ret.result.test).toBe('TEST');
    });

    test("ContractVarErrorReceived", (): void => {
        const ret = ContractVarErrorReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance);
        expect(ret.type).toBe('CONTRACT_VAR_ERROR_RECEIVED');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.methodHash).toBe(contractMethod);
        expect(ret.error.test).toBe('TEST');
    });

    test("ContractVarForceRefresh", (): void => {
        const ret = ContractVarForceRefresh(contractName, contractAddress, contractMethod, contractMethod);
        expect(ret.type).toBe('CONTRACT_VAR_FORCE_REFRESH');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
        expect(ret.methodName).toBe(contractMethod);
        expect(ret.methodHash).toBe(contractMethod);
    });

    test("ContractLoad", (): void => {
        const ret = ContractLoad(contractName, contractAddress);
        expect(ret.type).toBe('CONTRACT_LOAD');
        expect(ret.contractName).toBe(contractName);
        expect(ret.contractAddress).toBe(contractAddress);
    });

});
