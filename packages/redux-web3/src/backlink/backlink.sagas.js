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
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var redux_saga_1 = require("redux-saga");
var __1 = require("../..");
var Web3 = require("web3");
var backlink_actions_1 = require("./backlink.actions");
var contracts_actions_1 = require("../contracts/contracts.actions");
var web3_actions_1 = require("../web3/web3.actions");
var networkNames = {
    1: 'mainnet',
    3: 'ropsten',
    42: 'kovan',
    4: 'rinkeby'
};
function updateManager(action, backlink) {
    return __generator(this, function (_a) {
        return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                var instance;
                action._.eth.net.getId().then(function (id) {
                    var url;
                    url = backlink.config.url[id] || backlink.config.url[networkNames[id]];
                    if (!url && backlink.config.url["default"]) {
                        url = backlink.config.url["default"];
                    }
                    instance = new Web3(new Web3.providers.WebsocketProvider(url));
                    emit(backlink_actions_1.BacklinkConnected(instance, url));
                    emit(web3_actions_1.Web3BacklinkLoaded(action._, action.networkId, action.coinbase));
                    try {
                        instance.eth.subscribe('newBlockHeaders', function (error, result) {
                            if (error) {
                                emit(backlink_actions_1.BacklinkError(error));
                                emit(__1.FeedNewError(error, error.message, "[backlink.sagas.ts][updateManager] Error during run"));
                                emit(redux_saga_1.END);
                            }
                            else {
                                emit(backlink_actions_1.BacklinkNewBlockEvent(result));
                            }
                        });
                    }
                    catch (e) {
                        emit(backlink_actions_1.BacklinkError(e));
                        emit(__1.FeedNewError(e, e.message, "[backlink.sagas.ts][updateManager] Error during run"));
                        emit(redux_saga_1.END);
                    }
                }).catch(function (e) {
                    emit(backlink_actions_1.BacklinkError(e));
                    emit(__1.FeedNewError(e, e.message, "[backlink.sagas.ts][networkCheckLoading] Trying to initialize backlink"));
                    emit(redux_saga_1.END);
                });
                return (function () {
                    if (instance) {
                        instance.eth.clearSubscriptions();
                    }
                });
            })];
    });
}
function onBacklinkInit(action) {
    var backlink, _a, networkCheckChannel, event_1, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                backlink = (_b.sent()).backlink;
                _a = backlink.status;
                switch (_a) {
                    case 'LOADING': return [3 /*break*/, 2];
                    case 'DISABLED': return [3 /*break*/, 14];
                }
                return [3 /*break*/, 2];
            case 2:
                _b.trys.push([2, 11, , 13]);
                return [4 /*yield*/, effects_1.call(updateManager, action, backlink)];
            case 3:
                networkCheckChannel = _b.sent();
                _b.label = 4;
            case 4:
                _b.trys.push([4, , 9, 10]);
                _b.label = 5;
            case 5:
                if (!true) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(networkCheckChannel)];
            case 6:
                event_1 = _b.sent();
                return [4 /*yield*/, effects_1.put(event_1)];
            case 7:
                _b.sent();
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 10];
            case 9:
                networkCheckChannel.close();
                return [7 /*endfinally*/];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_1 = _b.sent();
                console.error(e_1);
                return [4 /*yield*/, effects_1.put(__1.FeedNewError(e_1, e_1.message, "[backlink.sagas.ts][onBacklinkInit] Trying to initialize backlink"))];
            case 12:
                _b.sent();
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 16];
            case 14:
                console.warn("[backlink.sagas.ts][onBacklinkInit] Disabled status for Backlink");
                return [4 /*yield*/, effects_1.put(web3_actions_1.Web3BacklinkLoaded(action._, action.networkId, action.coinbase))];
            case 15:
                _b.sent();
                return [2 /*return*/];
            case 16: return [2 /*return*/];
        }
    });
}
function onNewContract(action) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.put(backlink_actions_1.BacklinkCreateHook(action.contractAddress, false, true, function (arg, dispatch) {
                    dispatch(contracts_actions_1.ContractCompleteRefresh(action.contractName, action.contractAddress));
                }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function onNewAccount(action) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.put(backlink_actions_1.BacklinkCreateHook(action.address, true, true, function (arg, dispatch) {
                    dispatch(__1.AccountUpdateRequest(action.address));
                }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function recursiveBackwardFetcher(web3, block, height, depth, emit, hooks, dispatch) {
    if (!Object.keys(hooks).length) {
        emit(redux_saga_1.END);
    }
    else if (!block) {
        web3.eth.getBlock(height, true)
            .then(function (_block) {
            if (_block && _block.transactions) {
                recursiveBackwardFetcher(web3, _block, height, depth, emit, hooks, dispatch);
            }
            else if (depth && height >= 1) {
                recursiveBackwardFetcher(web3, null, height - 1, depth - 1, emit, hooks, dispatch);
            }
            else {
                var msg = "Unable to fetch Block";
                emit(__1.FeedNewError(new Error(msg), msg, "[backlink.sagas.ts][recursiveBackwardFetcher] Trying to fetch block"));
                emit(redux_saga_1.END);
            }
        })
            .catch(function (_error) {
            if (depth && height >= 1) {
                recursiveBackwardFetcher(web3, null, height - 1, depth - 1, emit, hooks, dispatch);
            }
            else {
                emit(__1.FeedNewError(_error, _error.message, "[backlink.sagas.ts][recursiveBackwardFetcher] Trying to fetch block"));
                emit(redux_saga_1.END);
            }
        });
    }
    else {
        for (var tx_idx = 0; tx_idx < block.transactions.length; ++tx_idx) {
            var _a = block.transactions[tx_idx], from = _a.from, to = _a.to;
            from = from.toLowerCase();
            to = to.toLowerCase();
            if (hooks[from] && hooks[from].length) {
                for (var from_idx = 0; from_idx < hooks[from].length; ++from_idx) {
                    if (hooks[from][from_idx].from) {
                        hooks[from][from_idx].trigger(block.transactions[tx_idx], dispatch);
                    }
                }
            }
            if (hooks[to] && hooks[to].length) {
                for (var to_idx = 0; to_idx < hooks[to].length; ++to_idx) {
                    if (hooks[to][to_idx].to) {
                        hooks[to][to_idx].trigger(block.transactions[tx_idx], dispatch);
                    }
                }
            }
        }
        emit(redux_saga_1.END);
    }
}
function fetchBlockCallTriggers(height, dispatch) {
    var state, instance_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = (_a.sent());
                if (state.backlink.status === 'CONNECTED') {
                    instance_1 = state.backlink.instance;
                    return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                            recursiveBackwardFetcher(instance_1, null, height, 5, emit, state.backlink.hooks, dispatch);
                            return (function () {
                            });
                        })];
                }
                else {
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
        }
    });
}
function onNewBlock(dispatch, action) {
    var fetcher, event_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!action.block.number) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.call(fetchBlockCallTriggers, action.block.number, dispatch)];
            case 1:
                fetcher = _a.sent();
                if (!fetcher) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 7, 8]);
                _a.label = 3;
            case 3:
                if (!true) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(fetcher)];
            case 4:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_2)];
            case 5:
                _a.sent();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                fetcher.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function BacklinkSagas(dispatch) {
    var boundOnNewBlock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeLatest('LOADED_WEB3', onBacklinkInit)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('CONTRACT_LOADED', onNewContract)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('ACCOUNT_ADD', onNewAccount)];
            case 3:
                _a.sent();
                boundOnNewBlock = onNewBlock.bind(null, dispatch);
                return [4 /*yield*/, effects_1.takeEvery('BACKLINK_NEW_BLOCK_EVENT', boundOnNewBlock)];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.BacklinkSagas = BacklinkSagas;
//# sourceMappingURL=backlink.sagas.js.map