declare var window: any;

import {
    Reducer,
    Store,
    compose,
    createStore,
    applyMiddleware,
    DeepPartial,
    combineReducers,
    ReducersMapObject
} from "redux";
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import {
    AccountConfigState,
    AccountStoreState,
    BacklinkConfigState,
    BacklinkState,
    ContractArtifactState,
    EventFeedElementState,
    EventSubscriptionState,
    FeedState,
    State,
    Web3LoadingState
} from './stateInterface';
import {reducers} from "./reducers";
import {rootSagaBuilder} from './sagas';
import TruffleArtifact from 'truffle-contract-schema';

export interface IPFSConfig {
    host: string,
    port: string,
    options?: any
}

export interface BacklinkConfig extends BacklinkConfigState {}

export interface GeneratorConfig<T> {
    reducer?: ReducersMapObject<T>,
    custom_state?: DeepPartial<T>,
    account_refresh_rate?: number,
    custom_sagas?: any[],
    ipfs_config?: IPFSConfig,
    backlink_config?: BacklinkConfig
}


export interface Contracts {
    type: string;
}

export interface EmbarkContracts extends Contracts {
    chains?: any,
    embark_contracts?: any,
    preloaded_contracts?: string[]
}

export interface TruffleContracts extends Contracts {
    truffle_contracts?: TruffleArtifact[]
    preloaded_contracts?: string[],
    network_contracts?: TruffleArtifact[]
}

export interface ManualContractArtifact {
    abi: any,
    at?: string,
    deployed_bytecode?: string
}

export interface ManualContractArtifactMap {
    [key:string]: ManualContractArtifact
}

export interface ManualContracts extends Contracts {
    manual_contracts?: ManualContractArtifactMap
}

export function forge<T extends State = State>(contracts: EmbarkContracts | TruffleContracts | ManualContracts, config: GeneratorConfig<T> = undefined): Store {

    let composer = compose;
    if (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }

    let initialState = {
        contracts: {},
        tx: {},
        web3: {},
        accounts: {},
        ipfs: {},
        backlink: {}
    } as DeepPartial<T>;

    (<Web3LoadingState>(<any>initialState).web3) = {
        status: 'LOADING'
    };

    (<AccountConfigState>(<AccountStoreState>(<any>initialState).accounts).configuration) = {
        refresh_rate: config ? (config.account_refresh_rate || 5000) : 5000
    };

    (<FeedState[]>(<any>initialState).feed) = [] as FeedState[];

    if (config && config.backlink_config) {
        (<DeepPartial<BacklinkState>>(<any>initialState).backlink) = {
            config: config.backlink_config,
            status: 'LOADING',
            hooks: {}
        } as DeepPartial<BacklinkState>;
    } else {
        (<DeepPartial<BacklinkState>>(<any>initialState).backlink) = {
            status: 'DISABLED'
        } as DeepPartial<BacklinkState>;
    }

    (<any>initialState.ipfs.config) = {
        config: config ? (config.ipfs_config || undefined) : undefined,
        active: false
    };

    initialState.event = {
        event_feed: [] as DeepPartial<EventFeedElementState>,
        subscriptions: {} as DeepPartial<EventSubscriptionState>
    } as DeepPartial<T['event']>;

    switch (contracts.type) {
        case 'truffle':
            const truffle_contracts: TruffleContracts = <TruffleContracts>contracts;
            for (let idx in truffle_contracts.truffle_contracts) {
                ((<ContractArtifactState>(<any>initialState).contracts)[truffle_contracts.truffle_contracts[idx].contractName]) = {
                    artifact: {
                        abi: truffle_contracts.truffle_contracts[idx].abi,
                        bytecode: truffle_contracts.truffle_contracts[idx].deployedBytecode,
                        name: truffle_contracts.truffle_contracts[idx].contractName
                    }
                };
            }

            ((<any>initialState).contracts).config = {
                type: "truffle",
                config: {
                    preloaded_contracts: truffle_contracts.preloaded_contracts,
                    contracts: truffle_contracts.truffle_contracts
                }
            };

            break ;
        case 'embark':
            const embark_contracts: EmbarkContracts = <EmbarkContracts>contracts;
            for (let idx in Object.keys(embark_contracts.embark_contracts)) {
                ((<ContractArtifactState>(<any>initialState).contracts)[Object.keys(embark_contracts.embark_contracts)[idx]]) = {
                    artifact: {
                        abi: embark_contracts.embark_contracts[Object.keys(embark_contracts.embark_contracts)[idx]].options.jsonInterface,
                        bytecode: embark_contracts.embark_contracts[Object.keys(embark_contracts.embark_contracts)[idx]].options.data,
                        name: Object.keys(embark_contracts.embark_contracts)[idx]
                    }
                };
            }

            ((<any>initialState).contracts).config = {
                type: "embark",
                config: {
                    preloaded_contracts: embark_contracts.preloaded_contracts,
                    chains: embark_contracts.chains
                }
            };

            break ;
        case 'manual':
            const manual_contract: ManualContracts = <ManualContracts>contracts;
            for (let idx in Object.keys(manual_contract.manual_contracts)) {
                ((<ContractArtifactState>(<any>initialState).contracts)[Object.keys(manual_contract.manual_contracts)[idx]]) = {
                    artifact: {
                        abi: manual_contract.manual_contracts[Object.keys(manual_contract.manual_contracts)[idx]].abi,
                        bytecode: manual_contract.manual_contracts[Object.keys(manual_contract.manual_contracts)[idx]].deployed_bytecode,
                        name: Object.keys(manual_contract.manual_contracts)[idx]
                    }
                }
            }

            ((<any>initialState).contracts).config = {
                type: 'manual',
                config: {
                    contracts: manual_contract.manual_contracts
                }
            };

            break ;
        default:
            throw new Error("Unknown Ethereum Framework");
    }

    let combinedInitialState = {
        ...(<object>(config ? config.custom_state : {})),
        ...(<object>initialState)
    } as DeepPartial<T>;

    let combinedReducer: Reducer<T>;
    if (config && config.reducer) {
        config.reducer = {
            ...(<object>config.reducer),
            ...(<object>reducers)
        } as ReducersMapObject<T>;
    } else {
        if (!config)
            config = {};
        config.reducer = reducers as ReducersMapObject<T>;
    }
    combinedReducer = combineReducers<T>(config.reducer);

    const sagaMiddleware: SagaMiddleware<any> = createSagaMiddleware<any>();

    const store: Store<T> = createStore<T, any, any, any>(combinedReducer, combinedInitialState, composer(applyMiddleware(sagaMiddleware)));

    if (config && config.custom_sagas)
        sagaMiddleware.run(rootSagaBuilder(...config.custom_sagas), store.dispatch);
    else
        sagaMiddleware.run(rootSagaBuilder(), store.dispatch);

    return (store);
}
