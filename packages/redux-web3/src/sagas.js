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
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("redux-saga/effects");
var web3_sagas_1 = require("./web3/web3.sagas");
var tx_sagas_1 = require("./tx/tx.sagas");
var contracts_saga_1 = require("./contracts/contracts.saga");
var accounts_saga_1 = require("./accounts/accounts.saga");
var ipfs_saga_1 = require("./ipfs/ipfs.saga");
var backlink_sagas_1 = require("./backlink/backlink.sagas");
var event_sagas_1 = require("./event/event.sagas");
exports.rootSagaBuilder = function () {
    var customSagas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        customSagas[_i] = arguments[_i];
    }
    return function rootSaga(dispatch) {
        var sagas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sagas = (__spread([web3_sagas_1.Web3Sagas, tx_sagas_1.TxSagas, contracts_saga_1.ContractSagas.bind(null, dispatch), accounts_saga_1.AccountSagas, ipfs_saga_1.IPFSSagas, backlink_sagas_1.BacklinkSagas.bind(null, dispatch), event_sagas_1.EventSagas], customSagas)).filter(function (elem) { return !!elem; }).map(function (elem) {
                        return effects_1.fork(elem);
                    });
                    return [4 /*yield*/, effects_1.all(sagas)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
};
//# sourceMappingURL=sagas.js.map