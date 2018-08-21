import {Reducer} from "redux";
import {ContractStoreState} from "../stateInterface";
import {
    ContractActions,
    ContractErrorAction,
    ContractLoadedAction,
    ContractLoadingAction, ContractSetDeployedAction,
    ContractVarErrorReceivedAction,
    ContractVarForceRefreshAction,
    ContractVarReceivedAction
} from "./contracts.actions";

const contractLoadingReducer: Reducer<ContractStoreState, ContractLoadingAction> = (state: ContractStoreState, action: ContractLoadingAction): ContractStoreState => {
    return {
        ...state,
        [action.contractName]: {
            ...(<Object>state)[action.contractName],
            [action.contractAddress.toLowerCase()]: {
                ...state[action.contractName][action.contractAddress.toLowerCase()],
                status: 'LOADING',
                instance: undefined,
                error: undefined
            }
        }
    }
};

const contractLoadedReducer: Reducer<ContractStoreState, ContractLoadedAction> = (state: ContractStoreState, action: ContractLoadedAction): ContractStoreState => {
    return {
        ...state,
        [action.contractName]: {
            ...(<Object>state)[action.contractName],
            [action.contractAddress.toLowerCase()]: {
                ...state[action.contractName][action.contractAddress.toLowerCase()],
                status: 'LOADED',
                instance: action.contractInstance,
                error: undefined
            }
        }
    }
};

const contractErrorReducer: Reducer<ContractStoreState, ContractErrorAction> = (state: ContractStoreState, action: ContractErrorAction): ContractStoreState => {
    return {
        ...state,
        [action.contractName]: {
            ...(<Object>state)[action.contractName],
            [action.contractAddress.toLowerCase()]: {
                ...state[action.contractName][action.contractAddress.toLowerCase()],
                status: 'ERROR',
                error: action.error
            }
        }
    }
};

const contractVarReceivedReducer: Reducer<ContractStoreState, ContractVarReceivedAction> = (state: ContractStoreState, action: ContractVarReceivedAction): ContractStoreState => {
    return {
        ...state,
        [action.contractName]: {
            ...(<Object>state)[action.contractName],
            [action.contractAddress.toLowerCase()]: {
                ...state[action.contractName][action.contractAddress.toLowerCase()],
                instance: {
                    ...state[action.contractName][action.contractAddress.toLowerCase()].instance,
                    vortexMethods: {
                        ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods,
                        [action.methodName]: {
                            ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName],
                            cache: {
                                ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache,
                                [action.methodHash]: {
                                    data: action.result,
                                    synced: true
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

const contractVarErrorReceivedReducer: Reducer<ContractStoreState, ContractVarErrorReceivedAction> = (state: ContractStoreState, action: ContractVarErrorReceivedAction): ContractStoreState => {
    return {
        ...state,
        [action.contractName]: {
            ...(<Object>state)[action.contractName],
            [action.contractAddress.toLowerCase()]: {
                ...state[action.contractName][action.contractAddress.toLowerCase()],
                instance: {
                    ...state[action.contractName][action.contractAddress.toLowerCase()].instance,
                    vortexMethods: {
                        ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods,
                        [action.methodName]: {
                            ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName],
                            cache: {
                                ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache,
                                [action.methodHash]: {
                                    error: action.error,
                                    synced: true
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

const contractVarForceRefreshReducer: Reducer<ContractStoreState, ContractVarForceRefreshAction> = (state: ContractStoreState, action: ContractVarForceRefreshAction): ContractStoreState => {
    return {
        ...state,
        [action.contractName]: {
            ...(<Object>state)[action.contractName],
            [action.contractAddress.toLowerCase()]: {
                ...state[action.contractName][action.contractAddress.toLowerCase()],
                instance: {
                    ...state[action.contractName][action.contractAddress.toLowerCase()].instance,
                    vortexMethods: {
                        ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods,
                        [action.methodName]: {
                            ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName],
                            cache: {
                                ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache,
                                [action.methodHash]: {
                                    ...state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache[action.methodHash],
                                    synced: false
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

const contractSetDeployedReducer: Reducer<ContractStoreState, ContractSetDeployedAction> = (state: ContractStoreState       , action: ContractSetDeployedAction): ContractStoreState => {
    return {
        ...state,
        [action.contract_name]: {
            ...(<Object>state)[action.contract_name],
            deployed: action.contract_address.toLowerCase()
        }
    }
};

export const contracts: Reducer<ContractStoreState, ContractActions> = (state: ContractStoreState = {}, action: ContractActions): ContractStoreState => {
    switch (action.type) {

        case 'CONTRACT_LOADING':
            return contractLoadingReducer(state, <ContractLoadingAction>action);
        case 'CONTRACT_LOADED':
            return contractLoadedReducer(state, <ContractLoadedAction>action);
        case 'CONTRACT_ERROR':
            return contractErrorReducer(state, <ContractErrorAction>action);
        case 'CONTRACT_VAR_RECEIVED':
            return contractVarReceivedReducer(state, <ContractVarReceivedAction>action);
        case 'CONTRACT_VAR_ERROR_RECEIVED':
            return contractVarErrorReceivedReducer(state, <ContractVarErrorReceivedAction>action);
        case 'CONTRACT_VAR_FORCE_REFRESH':
            return contractVarForceRefreshReducer(state, <ContractVarForceRefreshAction>action);
        case 'CONTRACT_SET_DEPLOYED':
            return contractSetDeployedReducer(state, <ContractSetDeployedAction>action);

        default:
            return state;
    }
};
