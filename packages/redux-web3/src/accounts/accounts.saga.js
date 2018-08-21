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
var accounts_actions_1 = require("./accounts.actions");
var feed_actions_1 = require("../feed/feed.actions");
var vortex_1 = require("../vortex");
var running = false;
function fetchAccount(address, coinbase, emit) {
    return new Promise(function (ok, ko) {
        vortex_1.Vortex.get().Store.getState().web3._.eth.getBalance(address).then(function (balance) {
            emit(accounts_actions_1.AccountUpdate(address, balance, coinbase));
            ok();
        }).catch(function (e) {
            ko(e);
        });
    });
}
function loopOnAccounts(emit) {
    return new Promise(function (ok, ko) {
        var refresh_rate = vortex_1.Vortex.get().Store.getState().accounts.configuration.refresh_rate;
        var accounts = vortex_1.Vortex.get().Store.getState().accounts;
        setTimeout(function () {
            Object.keys(accounts).filter(function (elem) { return (elem !== 'coinbase' && elem !== 'configuration'); }).forEach(function (address) {
                fetchAccount(address, !!accounts[address].coinbase, emit)
                    .then(function () {
                })
                    .catch(function (e) {
                    emit(accounts_actions_1.AccountError(address, e));
                    emit(feed_actions_1.FeedNewError(e, e.message, "[accounts.sagas.ts][loopOnAccounts] Trying to fetch account informations."));
                    ko(e);
                });
            });
            if (running)
                loopOnAccounts(emit).catch(function (e) {
                    emit(feed_actions_1.FeedNewError(e, e.message, "[accounts.sagas.ts][loopOnAccounts] Trying to fetch account informations."));
                    ko(e);
                });
        }, refresh_rate);
    });
}
function refreshLoop() {
    return __generator(this, function (_a) {
        return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                running = true;
                loopOnAccounts(emit).catch(function (e) {
                    emit(feed_actions_1.FeedNewError(e, e.message, "[accounts.sagas.ts][loopOnAccounts] Trying to fetch account informations."));
                    emit(redux_saga_1.END);
                });
                return (function () {
                    running = false;
                });
            })];
    });
}
function onAccountInit() {
    var state, coinbase, refresh_loop, event_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                state = (_a.sent());
                coinbase = state.web3.coinbase;
                return [4 /*yield*/, effects_1.put(accounts_actions_1.AccountAdd(coinbase, true))];
            case 2:
                _a.sent();
                if (!(state.backlink.status !== 'CONNECTED' && state.backlink.status !== 'LOADING')) return [3 /*break*/, 10];
                return [4 /*yield*/, effects_1.call(refreshLoop)];
            case 3:
                refresh_loop = _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, , 9, 10]);
                _a.label = 5;
            case 5:
                if (!true) return [3 /*break*/, 8];
                return [4 /*yield*/, effects_1.take(refresh_loop)];
            case 6:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_1)];
            case 7:
                _a.sent();
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 10];
            case 9:
                refresh_loop.close();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}
function singleFetch(action, new_address, coinbase) {
    return __generator(this, function (_a) {
        return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                fetchAccount(action.address.toLowerCase(), coinbase, emit).then(function () {
                    if (new_address) {
                        emit(feed_actions_1.FeedNewAccount(action.address.toLowerCase(), coinbase));
                    }
                    emit(redux_saga_1.END);
                }).catch(function (e) {
                    emit(accounts_actions_1.AccountError(action.address.toLowerCase(), e));
                    emit(feed_actions_1.FeedNewError(e, e.message, "[accounts.sagas.ts][singleFetch] Trying to fetch account informations."));
                    emit(redux_saga_1.END);
                });
                return (function () {
                });
            })];
    });
}
function onAccountAdd(action) {
    var add, event_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.call(singleFetch, action, true, action.coinbase)];
            case 1:
                add = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 7, 8]);
                _a.label = 3;
            case 3:
                if (!true) return [3 /*break*/, 6];
                return [4 /*yield*/, effects_1.take(add)];
            case 4:
                event_2 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_2)];
            case 5:
                _a.sent();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                add.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function onUpdateRequest(action) {
    var accounts, add, event_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                accounts = (_a.sent()).accounts;
                if (!accounts[action.address]) return [3 /*break*/, 9];
                return [4 /*yield*/, effects_1.call(singleFetch, action, false, !!accounts[action.address].coinbase)];
            case 2:
                add = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, , 8, 9]);
                _a.label = 4;
            case 4:
                if (!true) return [3 /*break*/, 7];
                return [4 /*yield*/, effects_1.take(add)];
            case 5:
                event_3 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_3)];
            case 6:
                _a.sent();
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 9];
            case 8:
                add.close();
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}
function AccountSagas() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeLatest('LOADED_WEB3_BACKLINK', onAccountInit)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('ACCOUNT_ADD', onAccountAdd)];
            case 2:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('ACCOUNT_UPDATE_REQUEST', onUpdateRequest)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.AccountSagas = AccountSagas;
//# sourceMappingURL=accounts.saga.js.map