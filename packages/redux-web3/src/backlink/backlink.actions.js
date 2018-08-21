"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacklinkConnect = function (url) {
    return {
        type: 'BACKLINK_CONNECT',
        url: url
    };
};
exports.BacklinkConnected = function (instance, url) {
    return {
        type: 'BACKLINK_CONNECTED',
        instance: instance,
        url: url
    };
};
exports.BacklinkError = function (error) {
    return {
        type: 'BACKLINK_ERROR',
        error: error
    };
};
exports.BacklinkDisconnect = function () {
    return {
        type: 'BACKLINK_DISCONNECT'
    };
};
exports.BacklinkDisconnected = function () {
    return {
        type: 'BACKLINK_DISCONNECTED'
    };
};
exports.BacklinkDisable = function () {
    return {
        type: 'BACKLINK_DISABLE'
    };
};
exports.BacklinkCreateHook = function (address, from, to, trigger) {
    return {
        type: 'BACKLINK_CREATE_HOOK',
        address: address,
        from: from,
        to: to,
        trigger: trigger
    };
};
exports.BacklinkRemoveHook = function (address) {
    return {
        type: 'BACKLINK_REMOVE_HOOK',
        address: address
    };
};
exports.BacklinkNewBlockEvent = function (block) {
    return {
        type: 'BACKLINK_NEW_BLOCK_EVENT',
        block: block
    };
};
//# sourceMappingURL=backlink.actions.js.map