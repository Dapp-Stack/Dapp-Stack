"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_saga_1 = require("redux-saga");
var reducers_1 = require("./reducers");
var sagas_1 = require("./sagas");
function forge(contracts, config) {
    if (config === void 0) { config = undefined; }
    var composer = redux_1.compose;
    if (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
    var initialState = {
        contracts: {},
        tx: {},
        web3: {},
        accounts: {},
        ipfs: {},
        backlink: {}
    };
    initialState.web3 = {
        status: 'LOADING'
    };
    initialState.accounts.configuration = {
        refresh_rate: config ? (config.account_refresh_rate || 5000) : 5000
    };
    initialState.feed = [];
    if (config && config.backlink_config) {
        initialState.backlink = {
            config: config.backlink_config,
            status: 'LOADING',
            hooks: {}
        };
    }
    else {
        initialState.backlink = {
            status: 'DISABLED'
        };
    }
    initialState.ipfs.config = {
        config: config ? (config.ipfs_config || undefined) : undefined,
        active: false
    };
    initialState.event = {
        event_feed: [],
        subscriptions: {}
    };
    switch (contracts.type) {
        case 'truffle':
            var truffle_contracts = contracts;
            for (var idx in truffle_contracts.truffle_contracts) {
                (initialState.contracts[truffle_contracts.truffle_contracts[idx].contractName]) = {
                    artifact: {
                        abi: truffle_contracts.truffle_contracts[idx].abi,
                        bytecode: truffle_contracts.truffle_contracts[idx].deployedBytecode,
                        name: truffle_contracts.truffle_contracts[idx].contractName
                    }
                };
            }
            (initialState.contracts).config = {
                type: "truffle",
                config: {
                    preloaded_contracts: truffle_contracts.preloaded_contracts,
                    contracts: truffle_contracts.truffle_contracts
                }
            };
            break;
        case 'embark':
            var embark_contracts = contracts;
            for (var idx in Object.keys(embark_contracts.embark_contracts)) {
                (initialState.contracts[Object.keys(embark_contracts.embark_contracts)[idx]]) = {
                    artifact: {
                        abi: embark_contracts.embark_contracts[Object.keys(embark_contracts.embark_contracts)[idx]].options.jsonInterface,
                        bytecode: embark_contracts.embark_contracts[Object.keys(embark_contracts.embark_contracts)[idx]].options.data,
                        name: Object.keys(embark_contracts.embark_contracts)[idx]
                    }
                };
            }
            (initialState.contracts).config = {
                type: "embark",
                config: {
                    preloaded_contracts: embark_contracts.preloaded_contracts,
                    chains: embark_contracts.chains
                }
            };
            break;
        case 'manual':
            var manual_contract = contracts;
            for (var idx in Object.keys(manual_contract.manual_contracts)) {
                (initialState.contracts[Object.keys(manual_contract.manual_contracts)[idx]]) = {
                    artifact: {
                        abi: manual_contract.manual_contracts[Object.keys(manual_contract.manual_contracts)[idx]].abi,
                        bytecode: manual_contract.manual_contracts[Object.keys(manual_contract.manual_contracts)[idx]].deployed_bytecode,
                        name: Object.keys(manual_contract.manual_contracts)[idx]
                    }
                };
            }
            (initialState.contracts).config = {
                type: 'manual',
                config: {
                    contracts: manual_contract.manual_contracts
                }
            };
            break;
        default:
            throw new Error("Unknown Ethereum Framework");
    }
    var combinedInitialState = __assign({}, (config ? config.custom_state : {}), initialState);
    var combinedReducer;
    if (config && config.reducer) {
        config.reducer = __assign({}, config.reducer, reducers_1.reducers);
    }
    else {
        if (!config)
            config = {};
        config.reducer = reducers_1.reducers;
    }
    combinedReducer = redux_1.combineReducers(config.reducer);
    var sagaMiddleware = redux_saga_1.default();
    var store = redux_1.createStore(combinedReducer, combinedInitialState, composer(redux_1.applyMiddleware(sagaMiddleware)));
    if (config && config.custom_sagas)
        sagaMiddleware.run(sagas_1.rootSagaBuilder.apply(void 0, __spread(config.custom_sagas)), store.dispatch);
    else
        sagaMiddleware.run(sagas_1.rootSagaBuilder(), store.dispatch);
    return (store);
}
exports.forge = forge;
//# sourceMappingURL=forge.js.map