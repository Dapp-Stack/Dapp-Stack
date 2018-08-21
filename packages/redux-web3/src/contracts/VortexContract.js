"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
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
var sha1 = require("sha1");
var vortex_1 = require("../vortex");
var contracts_actions_1 = require("./contracts.actions");
var TransactionArgumentList = [
    "from",
    "to",
    "gas",
    "gasPrice",
    "value",
    "data",
    "nonce"
];
var VortexContract = /** @class */ (function () {
    function VortexContract(artifact, address, coinbase, web3) {
        this._waiting_calls = {};
        var contract_instance = new web3.eth.Contract(artifact.abi, address, {
            from: coinbase,
            data: artifact.bytecode
        });
        contract_instance.vortexMethods = {};
        Object.assign(this, contract_instance);
        var _this = this;
        _this.artifact = artifact;
        for (var abi_idx = 0; abi_idx < artifact.abi.length; ++abi_idx) {
            if (artifact.abi[abi_idx].type === 'function') {
                _this.vortexMethods[artifact.abi[abi_idx].name] = {};
                if (artifact.abi[abi_idx].constant) {
                    _this.vortexMethods[artifact.abi[abi_idx].name].call = this.vortexCall.bind(this, artifact.abi[abi_idx].name, abi_idx);
                    _this.vortexMethods[artifact.abi[abi_idx].name].cache = {};
                    _this.vortexMethods[artifact.abi[abi_idx].name].data = this.getData.bind(this, artifact.abi[abi_idx].name);
                    _this.vortexMethods[artifact.abi[abi_idx].name].constantData = this.getDataWithoutRefresh.bind(this, artifact.abi[abi_idx].name);
                }
                else {
                    _this.vortexMethods[artifact.abi[abi_idx].name].send = this.vortexCall.bind(this, artifact.abi[abi_idx].name, abi_idx);
                }
            }
        }
    }
    VortexContract.callSignature = function () {
        var methodArguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            methodArguments[_i] = arguments[_i];
        }
        return (sha1(JSON.stringify({ methodArguments: methodArguments })));
    };
    VortexContract.prototype.getDataWithoutRefresh = function (methodName) {
        var methodArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            methodArguments[_i - 1] = arguments[_i];
        }
        var txArguments = {};
        if (methodArguments.length && typeof methodArguments[methodArguments.length - 1] === 'object') {
            for (var attribute_idx = 0; attribute_idx < Object.keys(methodArguments[methodArguments.length - 1]).length; ++attribute_idx) {
                if (TransactionArgumentList.indexOf(Object.keys(methodArguments[methodArguments.length - 1])[attribute_idx]) === -1) {
                    break;
                }
            }
            txArguments = methodArguments[methodArguments.length - 1];
            methodArguments.pop();
        }
        var _this = this;
        var signature = VortexContract.callSignature.apply(VortexContract, __spread(methodArguments));
        var dispatch = vortex_1.Vortex.get().Store.dispatch;
        _this.vortexMethods = vortex_1.Vortex.get().Store.getState().contracts[_this.artifact.name][_this._address.toLowerCase()].instance.vortexMethods;
        if ((_this.vortexMethods[methodName])) {
            if (_this._waiting_calls[methodName + signature] || _this.vortexMethods[methodName].cache[signature]) {
                if (!_this.vortexMethods[methodName].cache[signature].disable_refresh)
                    _this.vortexMethods[methodName].cache[signature] = { synced: true, disable_refresh: false };
                if (this._waiting_calls[methodName + signature] && _this.vortexMethods[methodName].cache[signature])
                    this._waiting_calls[methodName + signature] = false;
                return (_this.vortexMethods[methodName].cache[signature].data);
            }
            else {
                _this.vortexMethods[methodName].cache[signature] = { synced: false, disable_refresh: true };
                dispatch(contracts_actions_1.ContractCall.apply(void 0, __spread([_this.artifact.name, _this.options.address, methodName, txArguments, undefined], methodArguments)));
                this._waiting_calls[methodName + signature] = true;
            }
            return (_this.vortexMethods[methodName].cache[signature].data);
        }
        return (undefined);
    };
    VortexContract.prototype.getData = function (methodName) {
        var methodArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            methodArguments[_i - 1] = arguments[_i];
        }
        var txArguments = {};
        if (methodArguments.length && typeof methodArguments[methodArguments.length - 1] === 'object') {
            for (var attribute_idx = 0; attribute_idx < Object.keys(methodArguments[methodArguments.length - 1]).length; ++attribute_idx) {
                if (TransactionArgumentList.indexOf(Object.keys(methodArguments[methodArguments.length - 1])[attribute_idx]) === -1) {
                    break;
                }
            }
            txArguments = methodArguments[methodArguments.length - 1];
            methodArguments.pop();
        }
        var _this = this;
        var signature = VortexContract.callSignature.apply(VortexContract, __spread(methodArguments));
        var dispatch = vortex_1.Vortex.get().Store.dispatch;
        _this.vortexMethods = vortex_1.Vortex.get().Store.getState().contracts[_this.artifact.name][_this._address.toLowerCase()].instance.vortexMethods;
        if ((_this.vortexMethods[methodName])) {
            if (_this.vortexMethods[methodName].cache[signature]) {
                if (_this.vortexMethods[methodName].cache[signature].disable_refresh)
                    _this.vortexMethods[methodName].cache[signature] = __assign({}, _this.vortexMethods[methodName].cache[signature], { disable_refresh: false });
                if (!_this.vortexMethods[methodName].cache[signature].synced && !this._waiting_calls[methodName + signature]) {
                    dispatch(contracts_actions_1.ContractCall.apply(void 0, __spread([_this.artifact.name, _this.options.address, methodName, txArguments, undefined], methodArguments)));
                    this._waiting_calls[methodName + signature] = true;
                }
                else if (_this.vortexMethods[methodName].cache[signature].synced && this._waiting_calls[methodName + signature])
                    this._waiting_calls[methodName + signature] = false;
            }
            else {
                _this.vortexMethods[methodName].cache[signature] = { synced: false, disable_refresh: false };
                dispatch(contracts_actions_1.ContractCall.apply(void 0, __spread([_this.artifact.name, _this.options.address, methodName, txArguments, undefined], methodArguments)));
                this._waiting_calls[methodName + signature] = true;
            }
            return (_this.vortexMethods[methodName].cache[signature].data);
        }
        return (undefined);
    };
    VortexContract.prototype.vortexCall = function (methodName, methodAbiIndex) {
        var methodArguments = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            methodArguments[_i - 2] = arguments[_i];
        }
        var txArguments = {};
        if (methodArguments.length && typeof methodArguments[methodArguments.length - 1] === 'object') {
            for (var attribute_idx = 0; attribute_idx < Object.keys(methodArguments[methodArguments.length - 1]).length; ++attribute_idx) {
                if (TransactionArgumentList.indexOf(Object.keys(methodArguments[methodArguments.length - 1])[attribute_idx]) === -1) {
                    break;
                }
            }
            txArguments = methodArguments[methodArguments.length - 1];
            methodArguments.pop();
        }
        var _this = this;
        var _method_infos = _this._jsonInterface[methodAbiIndex];
        var _resolvers = {};
        var _ret = new Promise(function (ok, ko) {
            _resolvers.success = ok;
            _resolvers.error = ko;
        });
        if (!vortex_1.Vortex.get()) {
            console.error("Vortex is not initialized");
            return (_ret);
        }
        _this.vortexMethods = vortex_1.Vortex.get().Store.getState().contracts[_this.artifact.name][_this._address.toLowerCase()].instance.vortexMethods;
        var dispatch = vortex_1.Vortex.get().Store.dispatch;
        var signature = VortexContract.callSignature.apply(VortexContract, __spread(methodArguments));
        if (_method_infos.constant) {
            if (_this.vortexMethods[methodName].cache[signature] === undefined) {
                _this.vortexMethods[methodName].cache[signature] = {};
                _this.vortexMethods[methodName].cache[signature].synced = false;
            }
            if (!_this.vortexMethods[methodName].cache[signature].synced) {
                dispatch(contracts_actions_1.ContractCall.apply(void 0, __spread([_this.artifact.name, _this.options.address, methodName, txArguments, _resolvers], methodArguments)));
            }
            else {
                return (new Promise(function (ok, ko) {
                    ok(_this.vortexMethods[methodName].cache[signature].data);
                }));
            }
        }
        else {
            dispatch(contracts_actions_1.ContractSend.apply(void 0, __spread([_this.artifact.name, _this.options.address, methodName, txArguments, _resolvers], methodArguments)));
        }
        return (_ret);
    };
    return VortexContract;
}());
exports.VortexContract = VortexContract;
//# sourceMappingURL=VortexContract.js.map