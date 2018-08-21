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
var web3_actions_1 = require("./web3.actions");
var redux_saga_1 = require("redux-saga");
var tx_actions_1 = require("../tx/tx.actions");
var vortex_1 = require("../vortex");
function resolveWeb3(action) {
    var state, config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = (_a.sent());
                config = state.contracts.config;
                return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                        action.loader.then(function (web3) {
                            web3.eth.vortexSendRawTransaction = function (signedTx) {
                                var resolvers = {};
                                var differed_return = new Promise(function (ok, ko) {
                                    resolvers.success = ok;
                                    resolvers.error = ko;
                                });
                                vortex_1.Vortex.get().Store.dispatch(tx_actions_1.TxSendRaw(signedTx, web3, resolvers));
                                return differed_return;
                            };
                            web3.eth.vortexSendTransaction = function (txArgs) {
                                var resolvers = {};
                                var differed_return = new Promise(function (ok, ko) {
                                    resolvers.success = ok;
                                    resolvers.error = ko;
                                });
                                vortex_1.Vortex.get().Store.dispatch(tx_actions_1.TxSend(txArgs, web3, resolvers));
                                return differed_return;
                            };
                            switch (config.type) {
                                case 'manual':
                                case 'truffle':
                                    web3.eth.getCoinbase().then(function (coinbase) {
                                        if (!coinbase || coinbase === "") {
                                            emit(web3_actions_1.Web3Locked());
                                            emit(redux_saga_1.END);
                                        }
                                        else {
                                            web3.eth.net.getId().then(function (network_id) {
                                                if ((action.networks) && (action.networks.length) && (action.networks.indexOf(network_id) === -1)) {
                                                    emit(web3_actions_1.Web3NetworkError(network_id));
                                                    emit(redux_saga_1.END);
                                                }
                                                else {
                                                    emit(web3_actions_1.Web3Loaded(web3, network_id, coinbase));
                                                    emit(redux_saga_1.END);
                                                }
                                            }).catch(function (reason) {
                                                emit(web3_actions_1.Web3LoadError(reason));
                                                emit(redux_saga_1.END);
                                            });
                                        }
                                    }).catch(function (reason) {
                                        emit(web3_actions_1.Web3LoadError(reason));
                                        emit(redux_saga_1.END);
                                    });
                                    break;
                                case 'embark':
                                    web3.eth.getCoinbase().then(function (coinbase) {
                                        if (!coinbase || coinbase === "") {
                                            emit(web3_actions_1.Web3Locked());
                                            emit(redux_saga_1.END);
                                        }
                                        else {
                                            web3.eth.getBlock(0).then(function (zero) {
                                                if (!config.config.chains[zero.hash]) {
                                                    emit(web3_actions_1.Web3NetworkError(zero.hash));
                                                    emit(redux_saga_1.END);
                                                }
                                                else {
                                                    emit(web3_actions_1.Web3Loaded(web3, zero.hash, coinbase));
                                                    emit(redux_saga_1.END);
                                                }
                                            }).catch(function (reason) {
                                                emit(web3_actions_1.Web3LoadError(reason));
                                                emit(redux_saga_1.END);
                                            });
                                        }
                                    }).catch(function (reason) {
                                        emit(web3_actions_1.Web3LoadError(reason));
                                        emit(redux_saga_1.END);
                                    });
                                    break;
                            }
                        }).catch(function (reason) {
                            emit(web3_actions_1.Web3LoadError(reason));
                            emit(redux_saga_1.END);
                        });
                        return (function () { });
                    })];
        }
    });
}
function callResolveWeb3(action) {
    var web3, event_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.call(resolveWeb3, action)];
            case 1:
                web3 = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 7, 8]);
                _a.label = 3;
            case 3:
                if (!true) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(web3)];
            case 4:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_1)];
            case 5:
                _a.sent();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                web3.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function Web3Sagas() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeLatest('LOAD_WEB3', callResolveWeb3)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.Web3Sagas = Web3Sagas;
//# sourceMappingURL=web3.sagas.js.map