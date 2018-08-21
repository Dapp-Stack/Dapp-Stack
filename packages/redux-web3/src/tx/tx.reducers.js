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
exports.tx = function (state, action) {
    var _a, _b, _c, _d;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 'TX_BROADCASTED':
            return __assign({}, state, (_a = {}, _a[action.txHash] = __assign({}, state[action.txHash], { status: {
                    type: 'BROADCASTED',
                    transaction_hash: action.txHash,
                    timestamp: Date.now()
                }, transaction_arguments: action.txArgs }), _a));
        case 'TX_RECEIPT':
            return __assign({}, state, (_b = {}, _b[action.txHash] = __assign({}, state[action.txHash], { status: {
                    type: 'RECEIPT',
                    transaction_hash: action.txHash,
                    transaction_receipt: action.receipt,
                    timestamp: Date.now()
                }, transaction_arguments: __assign({}, state[action.txHash].transaction_arguments, action.txArgs) }), _b));
        case 'TX_CONFIRMED':
            return __assign({}, state, (_c = {}, _c[action.txHash] = __assign({}, state[action.txHash], { status: {
                    type: 'CONFIRMED',
                    transaction_hash: action.txHash,
                    transaction_receipt: action.confirmationReceipt,
                    transaction_confirmation_count: action.confirmationCount,
                    timestamp: Date.now()
                } }), _c));
        case 'TX_ERROR':
            return __assign({}, state, (_d = {}, _d[action.txHash] = __assign({}, state[action.txHash], { status: {
                    type: 'ERROR',
                    transaction_hash: action.txHash,
                    error: action.error,
                    timestamp: Date.now()
                } }), _d));
        default:
            return state;
    }
};
//# sourceMappingURL=tx.reducers.js.map