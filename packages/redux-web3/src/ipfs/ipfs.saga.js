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
var ipfs_actions_1 = require("./ipfs.actions");
var IPFSApi = require("ipfs-api");
var feed_actions_1 = require("../feed/feed.actions");
var IsIPFS = require("is-ipfs");
function IPFSFetchData(action) {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                config = (_a.sent()).ipfs.config;
                return [2 /*return*/, redux_saga_1.eventChannel(function (emit) {
                        config.instance.files.get(action.hash).then(function (result) {
                            for (var idx = 0; idx < result.length; ++idx) {
                                if (result[idx].content) {
                                    emit(ipfs_actions_1.IPFSLoaded(action.hash, result[idx].content));
                                }
                                else {
                                    emit(ipfs_actions_1.IPFSLoaded(result[idx].path, null));
                                }
                                emit(feed_actions_1.FeedNewIPFSContent(action.hash));
                            }
                            emit(redux_saga_1.END);
                        }).catch(function (e) {
                            emit(ipfs_actions_1.IPFSError(action.hash, e));
                            emit(feed_actions_1.FeedNewError(e, e.message, "[ipfs.saga.ts][IPFSFetchData] Trying to fetch ipfs hash " + action.hash));
                            emit(redux_saga_1.END);
                        });
                        return (function () { });
                    })];
        }
    });
}
function onLoadRequest(action) {
    var ipfs, config, exists, fetch, event_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                ipfs = (_a.sent()).ipfs;
                config = ipfs.config;
                if (!!config.active) return [3 /*break*/, 3];
                return [4 /*yield*/, effects_1.put(feed_actions_1.FeedNewError(new Error("IPFS not active"), "IPFS not active", "[ipfs.saga.ts][IPFSFetchData] Trying to fetch ipfs hash " + action.hash))];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                if (!(!action.hash || !IsIPFS.multihash(action.hash))) return [3 /*break*/, 5];
                return [4 /*yield*/, effects_1.put(feed_actions_1.FeedNewError(new Error("Invalid IPFS Hash " + action.hash), "Invalid IPFS Hash " + action.hash, "[ipfs.saga.ts][onLoadRequest] Trying to fetch ipfs hash " + action.hash))];
            case 4:
                _a.sent();
                return [2 /*return*/];
            case 5:
                exists = ipfs[action.hash];
                if (exists && exists.content)
                    return [2 /*return*/];
                return [4 /*yield*/, effects_1.call(IPFSFetchData, action)];
            case 6:
                fetch = _a.sent();
                _a.label = 7;
            case 7:
                _a.trys.push([7, , 12, 13]);
                _a.label = 8;
            case 8:
                if (!true) return [3 /*break*/, 11];
                return [4 /*yield*/, effects_1.take(fetch)];
            case 9:
                event_1 = _a.sent();
                return [4 /*yield*/, effects_1.put(event_1)];
            case 10:
                _a.sent();
                return [3 /*break*/, 8];
            case 11: return [3 /*break*/, 13];
            case 12:
                fetch.close();
                return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}
function initializeRequest(action) {
    var ipfs_config, IPFS, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.select()];
            case 1:
                ipfs_config = (_a.sent()).ipfs.config;
                if (!ipfs_config.config) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                IPFS = IPFSApi(ipfs_config.config.host, ipfs_config.config.port, ipfs_config.config.options);
                return [4 /*yield*/, effects_1.put(ipfs_actions_1.IPFSConnect(IPFS))];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.warn("[IPFS] Error while trying to connect to provided endpoint");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}
function IPFSSagas() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery('LOAD_WEB3', initializeRequest)];
            case 1:
                _a.sent();
                return [4 /*yield*/, effects_1.takeEvery('IPFS_LOAD', onLoadRequest)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.IPFSSagas = IPFSSagas;
//# sourceMappingURL=ipfs.saga.js.map