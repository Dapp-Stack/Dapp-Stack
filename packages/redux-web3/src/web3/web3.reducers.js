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
exports.web3 = function (state, action) {
    if (state === void 0) { state = { status: 'LOADING' }; }
    switch (action.type) {
        case 'LOAD_WEB3':
            return ({
                status: 'LOADING'
            });
        case 'LOADED_WEB3':
            return (__assign({}, state, { status: 'LOADED', network_id: action.networkId, _: action._, coinbase: action.coinbase }));
        case 'LOAD_ERROR_WEB3':
            return (__assign({}, state, { status: 'LOAD_ERROR', error: action.error }));
        case 'NETWORK_ERROR_WEB3':
            return (__assign({}, state, { status: 'NETWORK_ERROR', network_id: action.networkId }));
        case 'LOCKED_WEB3':
            return (__assign({}, state, { status: 'LOCKED' }));
        default:
            return state;
    }
};
//# sourceMappingURL=web3.reducers.js.map