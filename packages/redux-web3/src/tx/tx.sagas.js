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
var tx_actions_1 = require("./tx.actions");
var vortex_1 = require("../vortex");
var redux_saga_1 = require("redux-saga");
var feed_actions_1 = require("../feed/feed.actions");
var accounts_actions_1 = require("../accounts/accounts.actions");
var bn_js_1 = require("bn.js");
var toLower = [
    "to",
    "from",
    "gas",
    "gasPrice",
    "value"
];
function sendTransaction(action) {
    var transaction_hash, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = _a.sent();
                return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                        var _transactionEvents = undefined;
                        try {
                            _transactionEvents = action.web3.eth.sendTransaction(action.txArgs)
                                .on('transactionHash', function (_transaction_hash) {
                                transaction_hash = _transaction_hash;
                                if (action.resolvers) {
                                    action.resolvers.success(_transaction_hash);
                                    action.resolvers = undefined;
                                }
                                emit(feed_actions_1.FeedNewTransaction(_transaction_hash));
                                Object.keys(action.txArgs).forEach(function (key) {
                                    if (toLower.indexOf(key) !== -1) {
                                        action.txArgs[key] = action.txArgs[key].toLowerCase();
                                    }
                                });
                                emit(tx_actions_1.TxBroadcasted(_transaction_hash, action.txArgs));
                            })
                                .on('confirmation', function (_amount, _receipt) {
                                emit(tx_actions_1.TxConfirmed(transaction_hash, _receipt, _amount));
                                if (state.backlink.status !== 'CONNECTED' && state.backlink.status !== 'LOADING') {
                                    if (!(_amount % 5) || _amount < 5) {
                                        if (action.txArgs.from)
                                            emit(accounts_actions_1.AccountUpdateRequest(action.txArgs.from));
                                        if (action.txArgs.to)
                                            emit(accounts_actions_1.AccountUpdateRequest(action.txArgs.to));
                                    }
                                }
                                if (_amount >= 24)
                                    emit(redux_saga_1.END);
                            })
                                .on('receipt', function (_receipt) {
                                action.web3.eth.getTransaction(transaction_hash).then(function (txInfos) {
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
                                emit(feed_actions_1.FeedNewError(_error, _error.message, "[tx.sagas.ts][sendTransaction] Trying to send a transaction."));
                                if (action.resolvers) {
                                    action.resolvers.success(transaction_hash);
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
                            vortex_1.Vortex.get().Store.dispatch(feed_actions_1.FeedNewError(reason, reason.message, "[tx.sagas.ts][sendTransaction] Trying to send a transaction."));
                            if (action.resolvers) {
                                action.resolvers.error(transaction_hash);
                                action.resolvers = undefined;
                            }
                            emit(redux_saga_1.END);
                        }
                        return function () {
                            if (_transactionEvents)
                                _transactionEvents.off();
                        };
                    })];
        }
    });
}
function callSendTransaction(action) {
    var tx, event_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.call(sendTransaction, action)];
            case 1:
                tx = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 7, 8]);
                _a.label = 3;
            case 3:
                if (!true) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(tx)];
            case 4:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_1)];
            case 5:
                _a.sent();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                tx.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function sendRawTransaction(action) {
    var transaction_hash, coinbase, to, from;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                coinbase = (_a.sent()).web3.coinbase;
                to = undefined;
                from = undefined;
                return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                        var _transactionEvents = undefined;
                        try {
                            _transactionEvents = action.web3.eth.sendRawTransaction(action.signedTx)
                                .on('transactionHash', function (_transaction_hash) {
                                transaction_hash = _transaction_hash;
                                if (action.resolvers) {
                                    action.resolvers.success(_transaction_hash);
                                    action.resolvers = undefined;
                                }
                                emit(feed_actions_1.FeedNewTransaction(_transaction_hash));
                                emit(tx_actions_1.TxBroadcasted(_transaction_hash, { signed_transaction: action.signedTx }));
                            })
                                .on('confirmation', function (_amount, _receipt) {
                                emit(tx_actions_1.TxConfirmed(transaction_hash, _receipt, _amount));
                                if (!(_amount % 5) || _amount < 5) {
                                    if (to) {
                                        emit(accounts_actions_1.AccountUpdateRequest(to));
                                    }
                                    if (from) {
                                        emit(accounts_actions_1.AccountUpdateRequest(from));
                                    }
                                    emit(accounts_actions_1.AccountUpdateRequest(coinbase));
                                }
                                if (_amount >= 24)
                                    emit(redux_saga_1.END);
                            })
                                .on('receipt', function (_receipt) {
                                action.web3.eth.getTransaction(transaction_hash).then(function (txInfos) {
                                    from = txInfos.from.toLowerCase();
                                    to = txInfos.to.toLowerCase();
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
                                emit(feed_actions_1.FeedNewError(_error, _error.message, "[tx.sagas.ts][sendRawTransaction] Trying to send a raw transaction."));
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
                            vortex_1.Vortex.get().Store.dispatch(feed_actions_1.FeedNewError(reason, reason.message, "[tx.sagas.ts][sendRawTransaction] Trying to send a raw transaction."));
                            if (action.resolvers) {
                                action.resolvers.error(transaction_hash);
                                action.resolvers = undefined;
                            }
                            emit(redux_saga_1.END);
                        }
                        return function () {
                            if (_transactionEvents)
                                _transactionEvents.off();
                        };
                    })];
        }
    });
}
function callSendRawTransaction(action) {
    var tx, event_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.call(sendRawTransaction, action)];
            case 1:
                tx = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 7, 8]);
                _a.label = 3;
            case 3:
                if (!true) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(tx)];
            case 4:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_2)];
            case 5:
                _a.sent();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                tx.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function TxSagas() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery('TX_SEND', callSendTransaction)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('TX_SEND_RAW', callSendRawTransaction)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.TxSagas = TxSagas;
//# sourceMappingURL=tx.sagas.js.map