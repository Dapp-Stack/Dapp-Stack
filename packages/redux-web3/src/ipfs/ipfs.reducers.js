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
var IPFSLoadedReducer = function (state, action) {
    var _a;
    return __assign({}, state, (_a = {}, _a[action.hash] = {
        content: action.content
    }, _a));
};
var IPFSErrorReducer = function (state, action) {
    var _a;
    return __assign({}, state, (_a = {}, _a[action.hash] = {
        error: action.reason
    }, _a));
};
var IPFSConnectReducer = function (state, action) {
    return __assign({}, state, { config: __assign({}, state.config, { instance: action.instance, active: true }) });
};
exports.ipfs = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 'IPFS_LOADED':
            return IPFSLoadedReducer(state, action);
        case 'IPFS_ERROR':
            return IPFSErrorReducer(state, action);
        case 'IPFS_CONNECT':
            return IPFSConnectReducer(state, action);
        default:
            return state;
    }
};
//# sourceMappingURL=ipfs.reducers.js.map