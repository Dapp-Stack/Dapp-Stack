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
var AccountRemoveReducer = function (state, action) {
    delete state[action.address];
    return __assign({}, state);
};
var AccountUpdateReducer = function (state, action) {
    var _a, _b;
    if ((state[action.address] && state[action.address].coinbase) || action.coinbase)
        return __assign({}, state, (_a = {}, _a[action.address] = __assign({}, state[action.address], { balance: action.balance, coinbase: true }), _a.coinbase = __assign({}, state.coinbase, { balance: action.balance, coinbase: true }), _a));
    return __assign({}, state, (_b = {}, _b[action.address] = __assign({}, state[action.address], { balance: action.balance, coinbase: action.coinbase }), _b));
};
var AccountConfigReducer = function (state, action) {
    var inserter = {
        refresh_rate: action.refresh_rate
    };
    return __assign({}, state, { configuration: __assign({}, state.configuration, inserter) });
};
var AccountErrorReducer = function (state, action) {
    var _a, _b;
    if (state[action.address] && state[action.address].coinbase)
        return __assign({}, state, (_a = {}, _a[action.address] = __assign({}, state[action.address], { error: action.error }), _a.coinbase = __assign({}, state.coinbase, { error: action.error }), _a));
    return __assign({}, state, (_b = {}, _b[action.address] = __assign({}, state[action.address], { error: action.error }), _b));
};
exports.accounts = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 'ACCOUNT_REMOVE':
            return AccountRemoveReducer(state, action);
        case 'ACCOUNT_UPDATE':
            return AccountUpdateReducer(state, action);
        case 'ACCOUNT_CONFIG':
            return AccountConfigReducer(state, action);
        case 'ACCOUNT_ERROR':
            return AccountErrorReducer(state, action);
        default:
            return state;
    }
};
//# sourceMappingURL=accounts.reducers.js.map