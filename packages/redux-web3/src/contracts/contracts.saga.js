"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var redux_saga_1 = require("redux-saga");
var feed_actions_1 = require("../feed/feed.actions");
var web3_actions_1 = require("../web3/web3.actions");
var VortexContract_1 = require("./VortexContract");
var contracts_actions_1 = require("./contracts.actions");
var tx_actions_1 = require("../tx/tx.actions");
var vortex_1 = require("../vortex");
var accounts_actions_1 = require("../accounts/accounts.actions");
var bn_js_1 = require("bn.js");
var toLower = [
    "to",
    "from",
    "gas",
    "gasPrice",
    "value"
];
function runForceRefreshRoundOn(state, emit, contractName, instance_address) {
    Object.keys(state.contracts[contractName][instance_address].instance.vortexMethods).forEach(function (methodName) {
        if (state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache) {
            Object.keys(state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache).forEach(function (signature) {
                if (state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache[signature].synced
                    && !state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache[signature].disable_refresh) {
                    emit(contracts_actions_1.ContractVarForceRefresh(contractName, instance_address, methodName, signature));
                }
            });
        }
    });
}
exports.runForceRefreshRoundOn = runForceRefreshRoundOn;
function runForceRefreshRound(state, emit) {
    Object.keys(state.contracts).forEach(function (contractName) {
        Object.keys(state.contracts[contractName]).forEach(function (instance_address) {
            if (instance_address !== 'artifact' && state.contracts[contractName][instance_address].instance) {
                runForceRefreshRoundOn(state, emit, contractName, instance_address);
            }
        });
    });
}
exports.runForceRefreshRound = runForceRefreshRound;
function backgroundContractLoad() {
    return __generator(this, function (_a) {
        return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                var interval_id = setInterval(function () {
                    var state = vortex_1.Vortex.get().Store.getState();
                    runForceRefreshRound(state, emit);
                }, 15000);
                return (function () {
                    clearInterval(interval_id);
                });
            })];
    });
}
function loadContract(contractName, contractAddress, userAddress, web3) {
    var contracts, artifact, error, vortex_contract, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                contracts = (_a.sent()).contracts;
                artifact = contracts[contractName] ? contracts[contractName].artifact : undefined;
                if (!!artifact) return [3 /*break*/, 4];
                error = new Error("Unable to recover artifact for contract " + contractName + ":" + contractAddress);
                return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractError(contractName, contractAddress, error))];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.put(feed_actions_1.FeedNewError(error, error.message, "[contracts.saga.ts][loadContract] Trying to load artifact."))];
            case 3:
                _a.sent();
                return [2 /*return*/];
            case 4:
                if (contracts[contractName][contractAddress]) {
                    console.warn("Contract already in store");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractLoading(contractName, contractAddress))];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _a.trys.push([6, 7, , 10]);
                vortex_contract = new VortexContract_1.VortexContract(artifact, contractAddress, userAddress, web3);
                return [3 /*break*/, 10];
            case 7:
                e_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractError(contractName, contractAddress, e_1))];
            case 8:
                _a.sent();
                return [4 /*yield*/, effects_1.put(feed_actions_1.FeedNewError(e_1, e_1.message, "[contracts.saga.ts][loadContract] Trying to instantiate VortexContract."))];
            case 9:
                _a.sent();
                throw (e_1);
            case 10: return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractLoaded(contractName, contractAddress, vortex_contract))];
            case 11:
                _a.sent();
                return [4 /*yield*/, effects_1.put(feed_actions_1.FeedNewContract(contractName, contractAddress))];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
var compareBytecode = function (address, bytecode, web3) {
    return new Promise(function (ok, ko) {
        web3.eth.getCode(address).then(function (remote_bytecode) {
            if (remote_bytecode.indexOf('0x') === 0)
                remote_bytecode = remote_bytecode.substr(2);
            if (bytecode.indexOf('0x') === 0)
                bytecode = bytecode.substr(2);
            ok(bytecode.toLowerCase() === remote_bytecode.toLowerCase());
        }).catch(ko);
    });
};
function onLoadContractInitialize(action) {
    var state, contracts, backlink, contractNames, _a, recap, idx, contract_instance, save_contract_idx, e_2, contract_infos, to_preload, recap, idx, infos, e_3, config_contract, recap, idx, infos, status_1, e_4, auto_refresh, time_to_update;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = (_b.sent());
                contracts = state.contracts;
                backlink = state.backlink;
                contractNames = Object.keys(contracts);
                _a = contracts.config.type;
                switch (_a) {
                    case 'truffle': return [3 /*break*/, 2];
                    case 'embark': return [3 /*break*/, 12];
                    case 'manual': return [3 /*break*/, 22];
                }
                return [3 /*break*/, 34];
            case 2:
                _b.trys.push([2, 9, , 11]);
                recap = [];
                idx = 0;
                _b.label = 3;
            case 3:
                if (!(idx < contractNames.length)) return [3 /*break*/, 7];
                contract_instance = undefined;
                for (save_contract_idx = 0; save_contract_idx < contracts.config.config.contracts.length; ++save_contract_idx) {
                    if (contracts.config.config.contracts[save_contract_idx].contractName === contractNames[idx]) {
                        contract_instance = contracts.config.config.contracts[save_contract_idx];
                        break;
                    }
                }
                if (!(contract_instance && contract_instance.networks && contracts.config.config.preloaded_contracts.indexOf(contractNames[idx]) !== -1)) return [3 /*break*/, 6];
                if (contract_instance.networks[action.networkId] === undefined) {
                    console.warn("Contract " + contractNames[idx] + " has no instance on current network");
                    return [3 /*break*/, 7];
                }
                return [5 /*yield**/, __values(loadContract(contractNames[idx], contract_instance.networks[action.networkId].address.toLowerCase(), action.coinbase, action._))];
            case 4:
                _b.sent();
                return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractSetDeployed(contractNames[idx], contract_instance.networks[action.networkId].address))];
            case 5:
                _b.sent();
                recap.push({ name: contractNames[idx], address: contract_instance.networks[action.networkId].address.toLowerCase() });
                _b.label = 6;
            case 6:
                ++idx;
                return [3 /*break*/, 3];
            case 7: return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractPreloadDone(recap))];
            case 8:
                _b.sent();
                return [3 /*break*/, 11];
            case 9:
                e_2 = _b.sent();
                return [4 /*yield*/, effects_1.put(web3_actions_1.Web3LoadError(e_2))];
            case 10:
                _b.sent();
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 34];
            case 12:
                _b.trys.push([12, 19, , 21]);
                contract_infos = contracts.config.config.chains[action.networkId].contracts;
                to_preload = contracts.config.config.preloaded_contracts;
                recap = [];
                idx = 0;
                _b.label = 13;
            case 13:
                if (!(idx < Object.keys(contract_infos).length)) return [3 /*break*/, 17];
                infos = contract_infos[Object.keys(contract_infos)[idx]];
                if (!(to_preload.indexOf(infos.name) !== -1 && contracts[infos.name])) return [3 /*break*/, 16];
                return [5 /*yield**/, __values(loadContract(infos.name, infos.address.toLowerCase(), action.coinbase, action._))];
            case 14:
                _b.sent();
                return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractSetDeployed(infos.name, infos.address))];
            case 15:
                _b.sent();
                recap.push({ name: infos.name, address: infos.address.toLowerCase() });
                _b.label = 16;
            case 16:
                ++idx;
                return [3 /*break*/, 13];
            case 17: return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractPreloadDone(recap))];
            case 18:
                _b.sent();
                return [3 /*break*/, 21];
            case 19:
                e_3 = _b.sent();
                return [4 /*yield*/, effects_1.put(web3_actions_1.Web3LoadError(e_3))];
            case 20:
                _b.sent();
                return [3 /*break*/, 21];
            case 21: return [3 /*break*/, 34];
            case 22:
                _b.trys.push([22, 32, , 34]);
                config_contract = contracts.config.config.contracts;
                recap = [];
                idx = 0;
                _b.label = 23;
            case 23:
                if (!(idx < Object.keys(config_contract).length)) return [3 /*break*/, 30];
                infos = config_contract[Object.keys(config_contract)[idx]];
                if (!infos.at) return [3 /*break*/, 29];
                if (!infos.deployed_bytecode) return [3 /*break*/, 26];
                return [4 /*yield*/, effects_1.call(compareBytecode, infos.at, infos.deployed_bytecode, action._)];
            case 24:
                status_1 = _b.sent();
                if (!!status_1) return [3 /*break*/, 26];
                return [4 /*yield*/, effects_1.put(web3_actions_1.Web3NetworkError(action.networkId))];
            case 25:
                _b.sent();
                return [3 /*break*/, 30];
            case 26: return [5 /*yield**/, __values(loadContract(Object.keys(config_contract)[idx], infos.at.toLowerCase(), action.coinbase, action._))];
            case 27:
                _b.sent();
                return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractSetDeployed(Object.keys(config_contract)[idx], infos.at))];
            case 28:
                _b.sent();
                recap.push({ name: Object.keys(config_contract)[idx], address: infos.at.toLowerCase() });
                _b.label = 29;
            case 29:
                ++idx;
                return [3 /*break*/, 23];
            case 30: return [4 /*yield*/, effects_1.put(contracts_actions_1.ContractPreloadDone(recap))];
            case 31:
                _b.sent();
                return [3 /*break*/, 34];
            case 32:
                e_4 = _b.sent();
                return [4 /*yield*/, effects_1.put(web3_actions_1.Web3LoadError(e_4))];
            case 33:
                _b.sent();
                return [3 /*break*/, 34];
            case 34:
                if (!(backlink.status !== 'CONNECTED' && backlink.status !== 'LOADING')) return [3 /*break*/, 42];
                return [4 /*yield*/, effects_1.call(backgroundContractLoad)];
            case 35:
                auto_refresh = _b.sent();
                _b.label = 36;
            case 36:
                _b.trys.push([36, , 41, 42]);
                _b.label = 37;
            case 37:
                if (!true) return [3 /*break*/, 40];
                return [4 /*yield*/, effects_1.take(auto_refresh)];
            case 38:
                time_to_update = _b.sent();
                return [4 /*yield*/, effects_1.put(time_to_update)];
            case 39:
                _b.sent();
                return [3 /*break*/, 37];
            case 40: return [3 /*break*/, 42];
            case 41:
                auto_refresh.close();
                return [7 /*endfinally*/];
            case 42: return [2 /*return*/];
        }
    });
}
function contractCall(action, tx, arg_signature) {
    return __generator(this, function (_a) {
        return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                tx.call(action.transactionArgs).then(function (result) {
                    emit(contracts_actions_1.ContractVarReceived(action.contractName, action.contractAddress, action.methodName, arg_signature, result));
                    if (action.resolvers)
                        action.resolvers.success(result);
                }).catch(function (error) {
                    emit(contracts_actions_1.ContractVarErrorReceived(action.contractName, action.contractAddress, action.methodName, arg_signature, error));
                    emit(feed_actions_1.FeedNewError(error, error.message, "[contracts.saga.ts][contractCall] Trying to recover constant call result."));
                    if (action.resolvers)
                        action.resolvers.error(error);
                });
                return (function () {
                });
            })];
    });
}
function onContractCall(action) {
    var _a, contracts, current_contract, arg_signature, ctcall, resolution;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                action.contractAddress = action.contractAddress.toLowerCase();
                return [4 /*yield*/, effects_1.select()];
            case 1:
                contracts = (_b.sent()).contracts;
                current_contract = contracts[action.contractName][action.contractAddress].instance;
                arg_signature = VortexContract_1.VortexContract.callSignature.apply(VortexContract_1.VortexContract, __spread(action.methodArgs));
                if (!!current_contract.vortexMethods[action.methodName].cache[arg_signature].synced) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.call(contractCall, action, (_a = current_contract.methods)[action.methodName].apply(_a, __spread(action.methodArgs)), arg_signature)];
            case 2:
                ctcall = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, , 8, 9]);
                _b.label = 4;
            case 4:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(ctcall)];
            case 5:
                resolution = _b.sent();
                return [4 /*yield*/, effects_1.put(resolution)];
            case 6:
                _b.sent();
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 9];
            case 8:
                ctcall.close();
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}
function contractSend(action, tx, web3) {
    var transaction_hash, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                        var tx_events = undefined;
                        try {
                            tx_events = tx.send(action.transactionArgs)
                                .on('transactionHash', function (_transaction_hash) {
                                transaction_hash = _transaction_hash;
                                if (action.resolvers) {
                                    action.resolvers.success(_transaction_hash);
                                    action.resolvers = undefined;
                                }
                                emit(feed_actions_1.FeedNewTransaction(_transaction_hash));
                                Object.keys(action.transactionArgs).forEach(function (key) {
                                    if (toLower.indexOf(key) !== -1 && typeof (action.transactionArgs[key]) === 'string') {
                                        action.transactionArgs[key] = action.transactionArgs[key].toLowerCase();
                                    }
                                });
                                emit(tx_actions_1.TxBroadcasted(_transaction_hash, action.transactionArgs));
                            })
                                .on('confirmation', function (_amount, _receipt) {
                                emit(tx_actions_1.TxConfirmed(transaction_hash, _receipt, _amount));
                                if (state.backlink.status !== 'CONNECTED' && state.backlink.status !== 'LOADING') {
                                    if (!(_amount % 5) || _amount < 5) {
                                        runForceRefreshRoundOn(state, emit, action.contractName, action.contractAddress);
                                        if (action.transactionArgs.from)
                                            emit(accounts_actions_1.AccountUpdateRequest(action.transactionArgs.from));
                                        if (action.transactionArgs.to)
                                            emit(accounts_actions_1.AccountUpdateRequest(action.transactionArgs.to));
                                    }
                                }
                                if (_amount >= 24)
                                    emit(redux_saga_1.END);
                            })
                                .on('receipt', function (_receipt) {
                                web3.eth.getTransaction(transaction_hash).then(function (txInfos) {
                                    vortex_1.Vortex.get().Store.dispatch(tx_actions_1.TxReceipt(transaction_hash, _receipt, {
                                        from: txInfos.from.toLowerCase(),
                                        to: txInfos.to.toLowerCase(),
                                        gas: '0x' + (new bn_js_1.BN(txInfos.gas)).toString(16).toLowerCase(),
                                        gasPrice: '0x' + (new bn_js_1.BN(txInfos.gasPrice)).toString(16).toLowerCase(),
                                        data: txInfos.input,
                                        nonce: txInfos.nonce,
                                        value: '0x' + (new bn_js_1.BN(txInfos.value)).toString(16).toLowerCase()
                                    }));
                                });
                            })
                                .on('error', function (_error) {
                                if (transaction_hash === undefined) {
                                    transaction_hash = 'last';
                                }
                                emit(tx_actions_1.TxError(transaction_hash, _error));
                                emit(feed_actions_1.FeedNewError(_error, _error.message, "[contracts.sagas.ts][contractSend.error] Trying to send method call."));
                                if (action.resolvers) {
                                    action.resolvers.error(transaction_hash);
                                    action.resolvers = undefined;
                                }
                                emit(redux_saga_1.END);
                            });
                        }
                        catch (reason) {
                            if (transaction_hash === undefined) {
                                transaction_hash = 'last';
                            }
                            vortex_1.Vortex.get().Store.dispatch(tx_actions_1.TxError(transaction_hash, reason));
                            vortex_1.Vortex.get().Store.dispatch(feed_actions_1.FeedNewError(reason, reason.message, "[contracts.sagas.ts][contractSend.catch] Trying to send method call."));
                            if (action.resolvers) {
                                action.resolvers.error(transaction_hash);
                                action.resolvers = undefined;
                            }
                            emit(redux_saga_1.END);
                        }
                        return (function () {
                            tx_events.off();
                        });
                    })];
        }
    });
}
function onContractSend(action) {
    var _a, current_state, current_contract, ctsend, resolution;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                action.contractAddress = action.contractAddress.toLowerCase();
                return [4 /*yield*/, effects_1.select()];
            case 1:
                current_state = (_b.sent());
                current_contract = current_state.contracts[action.contractName][action.contractAddress].instance;
                return [4 /*yield*/, effects_1.call(contractSend, action, (_a = current_contract.methods)[action.methodName].apply(_a, __spread(action.methodArgs)), current_state.web3._)];
            case 2:
                ctsend = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, , 8, 9]);
                _b.label = 4;
            case 4:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(ctsend)];
            case 5:
                resolution = _b.sent();
                return [4 /*yield*/, effects_1.put(resolution)];
            case 6:
                _b.sent();
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 9];
            case 8:
                ctsend.close();
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}
function onContractLoad(action) {
    var _a, coinbase, _;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                _a = (_b.sent()).web3, coinbase = _a.coinbase, _ = _a._;
                return [5 /*yield**/, __values(loadContract(action.contractName, action.contractAddress, coinbase, _))];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function onContractCompleteRefresh(dispatch, action) {
    var state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                runForceRefreshRoundOn(state, dispatch, action.contract_name, action.contract_address);
                return [2 /*return*/];
        }
    });
}
function ContractSagas(dispatch) {
    var boundOnContractCompleteRefresh;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeLatest('LOADED_WEB3_BACKLINK', onLoadContractInitialize)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('CONTRACT_LOAD', onContractLoad)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('CONTRACT_CALL', onContractCall)];
            case 3:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('CONTRACT_SEND', onContractSend)];
            case 4:
                _a.sent();
                boundOnContractCompleteRefresh = onContractCompleteRefresh.bind(null, dispatch);
                return [4 /*yield*/, effects_1.takeEvery('CONTRACT_COMPLETE_REFRESH', boundOnContractCompleteRefresh)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.ContractSagas = ContractSagas;
//# sourceMappingURL=contracts.saga.js.map