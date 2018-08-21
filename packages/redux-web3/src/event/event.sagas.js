"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var redux_saga_1 = require("redux-saga");
var event_actions_1 = require("./event.actions");
var __1 = require("../..");
function createSubscription(contract_address, contract_name, event_name, args, event_signature, link) {
    var _this = this;
    return __generator(this, function (_a) {
        return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                var subscription;
                var subscription_creator = function () { return __awaiter(_this, void 0, void 0, function () {
                    var running_1;
                    return __generator(this, function (_a) {
                        try {
                            running_1 = false;
                            subscription = link.eth.subscribe("logs", {
                                address: contract_address,
                                topics: __spread([event_signature], args)
                            }, function (err, result) {
                                if (!running_1) {
                                    running_1 = true;
                                }
                                if (err) {
                                    subscription.unsubscribe(function () { });
                                    throw err;
                                }
                                emit(event_actions_1.EventBroadcasted(event_name, contract_name, contract_address, result));
                            });
                            subscription.killChannel = function () {
                                emit(redux_saga_1.END);
                            };
                        }
                        catch (e) {
                            emit(__1.FeedNewError(e, e.message, "[event.sagas.ts][createSubscription] Trying to add event"));
                            throw e;
                        }
                        return [2 /*return*/];
                    });
                }); };
                subscription_creator()
                    .then(function () {
                    emit(event_actions_1.EventInsertSubscription(event_name + ":" + contract_name + ":" + contract_address, subscription));
                })
                    .catch(function (e) {
                    emit(redux_saga_1.END);
                });
                return (function () {
                    subscription.unsubscribe(function (error, ok) {
                    });
                });
            })];
    });
}
function onEventAdd(action) {
    var state, error, error, found, abi_idx, error, create_subscription, event_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                action.contract_address = action.contract_address.toLowerCase();
                return [4 /*yield*/, (effects_1.select())];
            case 1:
                state = _a.sent();
                if (state.backlink.status !== 'CONNECTED') {
                    error = ("[event.sagas.ts][onEventAdd] Request Event listening while backlink is not connected. Events won't be fetched.");
                    console.warn(error);
                    return [2 /*return*/];
                }
                if (!(!state.contracts || !state.contracts[action.contract_name] || !state.contracts[action.contract_name].artifact || !state.contracts[action.contract_name].artifact.abi)) return [3 /*break*/, 3];
                error = new Error("Request Event listening on unknown contract type " + action.contract_name);
                console.error(error);
                return [4 /*yield*/, effects_1.put(__1.FeedNewError(error, error.message, "[event.sagas.ts][onEventAdd] Trying to add event " + action.event_name))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                for (abi_idx = 0; abi_idx < state.contracts[action.contract_name].artifact.abi.length; ++abi_idx) {
                    if (state.contracts[action.contract_name].artifact.abi[abi_idx].type === 'event' && state.contracts[action.contract_name].artifact.abi[abi_idx].name === action.event_name) {
                        found = state.contracts[action.contract_name].artifact.abi[abi_idx].signature;
                    }
                }
                if (!!found) return [3 /*break*/, 5];
                error = new Error("No such event " + action.event_name + " in contract " + action.contract_name);
                console.error(error);
                return [4 /*yield*/, effects_1.put(__1.FeedNewError(error, error.message, "[event.sagas.ts][onEventAdd] Trying to add event " + action.event_name))];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, effects_1.call(createSubscription, action.contract_address, action.contract_name, action.event_name, action.args || [], found, state.backlink.instance)];
            case 6:
                create_subscription = _a.sent();
                _a.label = 7;
            case 7:
                _a.trys.push([7, , 12, 13]);
                _a.label = 8;
            case 8:
                if (!true) return [3 /*break*/, 11];
                return [4 /*yield*/, effects_1.take(create_subscription)];
            case 9:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_1)];
            case 10:
                _a.sent();
                return [3 /*break*/, 8];
            case 11: return [3 /*break*/, 13];
            case 12:
                create_subscription.close();
                return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}
function EventSagas() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery('EVENT_ADD', onEventAdd)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.EventSagas = EventSagas;
//# sourceMappingURL=event.sagas.js.map