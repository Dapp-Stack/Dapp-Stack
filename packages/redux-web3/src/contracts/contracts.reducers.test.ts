import {
    ContractLoading,
    ContractLoaded,
    ContractError,
    ContractVarReceived,
    ContractVarErrorReceived,
} from "./contracts.actions";

import {contracts} from "./contracts.reducers";

declare let describe: any;
declare let test: any;
declare let expect: any;


let contractName: string = "Ballot";
let contractAddress: string = "0xabcde";
let contractMethod: string = "owner";
let contractInstance: any = {
    methods: {
        [contractMethod]: {}
    },
    test: 'TEST'
};

let state = {
    [contractName]: {
        artifact: {}
    }
} as any;

describe("Contracts Reducers", (): void => {

    test("ContractLoading", (): void => {
        state = contracts(state, ContractLoading(contractName, contractAddress));
        expect(state[contractName][contractAddress].status).toBe('LOADING');
    });

    test("ContractLoaded", (): void => {
        state = contracts(state, ContractLoaded(contractName, contractAddress, contractInstance));
        expect(state[contractName][contractAddress].status).toBe('LOADED');
    });

    test("ContractError", (): void => {
        state = contracts(state, ContractError(contractName, contractAddress, contractInstance));
        state[contractName][contractAddress].instance = {
            vortexMethods: {
                [contractMethod]: {
                    cache: {
                        [contractMethod]: {
                            synced: false
                        }
                    }
                }
            }
        };
        expect(state[contractName][contractAddress].status).toBe('ERROR')
    });

    test("ContractVarReceived", (): void => {
        state = contracts(state, ContractVarReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance));
        expect(state[contractName][contractAddress].instance.vortexMethods[contractMethod].cache[contractMethod].data.test).toBe('TEST');
    });

    test("ContractVarErrorReceived", (): void => {
        state = contracts(state, ContractVarErrorReceived(contractName, contractAddress, contractMethod, contractMethod, contractInstance));
        expect(state[contractName][contractAddress].instance.vortexMethods[contractMethod].cache[contractMethod].error.test).toBe('TEST');
    });

});
