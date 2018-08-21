"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAdd = function (address, coinbase) {
    if (coinbase === void 0) { coinbase = false; }
    return {
        type: 'ACCOUNT_ADD',
        address: address,
        coinbase: coinbase
    };
};
exports.AccountRemove = function (address) {
    return {
        type: 'ACCOUNT_REMOVE',
        address: address
    };
};
exports.AccountUpdate = function (address, balance, coinbase) {
    if (coinbase === void 0) { coinbase = false; }
    return {
        type: 'ACCOUNT_UPDATE',
        address: address,
        balance: balance,
        coinbase: coinbase
    };
};
exports.AccountError = function (address, error) {
    return {
        type: 'ACCOUNT_ERROR',
        address: address.toLowerCase(),
        error: error
    };
};
exports.AccountConfig = function (config) {
    return __assign({}, config, { type: 'ACCOUNT_CONFIG' });
};
exports.AccountUpdateRequest = function (address) {
    return {
        type: 'ACCOUNT_UPDATE_REQUEST',
        address: address.toLowerCase()
    };
};
//# sourceMappingURL=accounts.actions.js.map