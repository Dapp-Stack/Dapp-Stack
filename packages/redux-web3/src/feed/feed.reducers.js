"use strict";
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
exports.feed = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 'FEED_NEW_TRANSACTION':
            state.push({
                action: 'NEW_TRANSACTION',
                transaction_hash: action.txHash,
                timestamp: Date.now()
            });
            return __spread(state);
        case 'FEED_NEW_CONTRACT':
            state.push({
                action: 'NEW_CONTRACT',
                contract_name: action.contractName,
                contract_address: action.address,
                timestamp: Date.now()
            });
            return __spread(state);
        case 'FEED_NEW_ERROR':
            console.warn("[Feed Error]: " + action.message + " => " + action.when);
            state.push({
                action: 'NEW_ERROR',
                error: {
                    reason: action.reason,
                    message: action.message,
                    when: action.when
                },
                timestamp: Date.now()
            });
            return __spread(state);
        case 'FEED_NEW_ACCOUNT':
            state.push({
                action: 'NEW_ACCOUNT',
                account: action.account,
                coinbase: action.coinbase,
                timestamp: Date.now()
            });
            return __spread(state);
        case 'FEED_NEW_IPFS_CONTENT':
            state.push({
                action: 'NEW_IPFS_CONTENT',
                ipfs_hash: action.ipfs_hash,
                timestamp: Date.now()
            });
            return __spread(state);
        default:
            return state;
    }
};
//# sourceMappingURL=feed.reducers.js.map