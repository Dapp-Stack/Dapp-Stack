"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
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
var BacklinkConnectedReducer = function (state, action) {
    return __assign({}, state, { status: 'CONNECTED', url: action.url, instance: action.instance });
};
var BacklinkErrorReducer = function (state, action) {
    return __assign({}, state, { status: 'ERROR', error: action.error, instance: undefined });
};
var BacklinkDisconnectedReducer = function (state, action) {
    return __assign({}, state, { status: 'DISCONNECTED', instance: undefined });
};
var BacklinkDisableReducer = function (state, action) {
    return __assign({}, state, { status: 'DISABLED', instance: undefined });
};
var BacklinkCreateHookReducer = function (state, action) {
    var _a;
    if (!state.hooks)
        state.hooks = {};
    if (!state.hooks[action.address.toLowerCase()])
        state.hooks[action.address.toLowerCase()] = [];
    state.hooks[action.address.toLowerCase()].push({
        from: action.from,
        to: action.to,
        trigger: action.trigger
    });
    return __assign({}, state, { hooks: __assign({}, state.hooks, (_a = {}, _a[action.address.toLowerCase()] = __spread(state.hooks[action.address.toLowerCase()]), _a)) });
};
var BacklinkRemoveHookReducer = function (state, action) {
    var _a = state.hooks, _b = action.address.toLowerCase(), _ = _a[_b], hooks = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
    return __assign({}, state, { hooks: __assign({}, hooks) });
};
exports.backlink = function (state, action) {
    if (state === void 0) { state = { status: 'DISABLED' }; }
    switch (action.type) {
        case 'BACKLINK_CONNECTED':
            return (BacklinkConnectedReducer(state, action));
        case 'BACKLINK_ERROR':
            return (BacklinkErrorReducer(state, action));
        case 'BACKLINK_DISCONNECTED':
            return (BacklinkDisconnectedReducer(state, action));
        case 'BACKLINK_DISABLE':
            return (BacklinkDisableReducer(state, action));
        case 'BACKLINK_CREATE_HOOK':
            return (BacklinkCreateHookReducer(state, action));
        case 'BACKLINK_REMOVE_HOOK':
            return (BacklinkRemoveHookReducer(state, action));
        default:
            return state;
    }
};
//# sourceMappingURL=backlink.reducers.js.map