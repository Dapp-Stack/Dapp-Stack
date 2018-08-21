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
var contractLoadingReducer = function (state, action) {
    var _a, _b;
    return __assign({}, state, (_a = {}, _a[action.contractName] = __assign({}, state[action.contractName], (_b = {}, _b[action.contractAddress.toLowerCase()] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()], { status: 'LOADING', instance: undefined, error: undefined }), _b)), _a));
};
var contractLoadedReducer = function (state, action) {
    var _a, _b;
    return __assign({}, state, (_a = {}, _a[action.contractName] = __assign({}, state[action.contractName], (_b = {}, _b[action.contractAddress.toLowerCase()] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()], { status: 'LOADED', instance: action.contractInstance, error: undefined }), _b)), _a));
};
var contractErrorReducer = function (state, action) {
    var _a, _b;
    return __assign({}, state, (_a = {}, _a[action.contractName] = __assign({}, state[action.contractName], (_b = {}, _b[action.contractAddress.toLowerCase()] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()], { status: 'ERROR', error: action.error }), _b)), _a));
};
var contractVarReceivedReducer = function (state, action) {
    var _a, _b, _c, _d;
    return __assign({}, state, (_a = {}, _a[action.contractName] = __assign({}, state[action.contractName], (_b = {}, _b[action.contractAddress.toLowerCase()] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()], { instance: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance, { vortexMethods: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods, (_c = {}, _c[action.methodName] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName], { cache: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache, (_d = {}, _d[action.methodHash] = {
                    data: action.result,
                    synced: true
                }, _d)) }), _c)) }) }), _b)), _a));
};
var contractVarErrorReceivedReducer = function (state, action) {
    var _a, _b, _c, _d;
    return __assign({}, state, (_a = {}, _a[action.contractName] = __assign({}, state[action.contractName], (_b = {}, _b[action.contractAddress.toLowerCase()] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()], { instance: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance, { vortexMethods: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods, (_c = {}, _c[action.methodName] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName], { cache: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache, (_d = {}, _d[action.methodHash] = {
                    error: action.error,
                    synced: true
                }, _d)) }), _c)) }) }), _b)), _a));
};
var contractVarForceRefreshReducer = function (state, action) {
    var _a, _b, _c, _d;
    return __assign({}, state, (_a = {}, _a[action.contractName] = __assign({}, state[action.contractName], (_b = {}, _b[action.contractAddress.toLowerCase()] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()], { instance: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance, { vortexMethods: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods, (_c = {}, _c[action.methodName] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName], { cache: __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache, (_d = {}, _d[action.methodHash] = __assign({}, state[action.contractName][action.contractAddress.toLowerCase()].instance.vortexMethods[action.methodName].cache[action.methodHash], { synced: false }), _d)) }), _c)) }) }), _b)), _a));
};
var contractSetDeployedReducer = function (state, action) {
    var _a;
    return __assign({}, state, (_a = {}, _a[action.contract_name] = __assign({}, state[action.contract_name], { deployed: action.contract_address.toLowerCase() }), _a));
};
exports.contracts = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 'CONTRACT_LOADING':
            return contractLoadingReducer(state, action);
        case 'CONTRACT_LOADED':
            return contractLoadedReducer(state, action);
        case 'CONTRACT_ERROR':
            return contractErrorReducer(state, action);
        case 'CONTRACT_VAR_RECEIVED':
            return contractVarReceivedReducer(state, action);
        case 'CONTRACT_VAR_ERROR_RECEIVED':
            return contractVarErrorReceivedReducer(state, action);
        case 'CONTRACT_VAR_FORCE_REFRESH':
            return contractVarForceRefreshReducer(state, action);
        case 'CONTRACT_SET_DEPLOYED':
            return contractSetDeployedReducer(state, action);
        default:
            return state;
    }
};
//# sourceMappingURL=contracts.reducers.js.map