"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IPFSLoad(hash) {
    return {
        type: 'IPFS_LOAD',
        hash: hash
    };
}
exports.IPFSLoad = IPFSLoad;
function IPFSLoaded(hash, content) {
    return {
        type: 'IPFS_LOADED',
        hash: hash,
        content: content
    };
}
exports.IPFSLoaded = IPFSLoaded;
function IPFSError(hash, reason) {
    return {
        type: 'IPFS_ERROR',
        hash: hash,
        reason: reason
    };
}
exports.IPFSError = IPFSError;
function IPFSConnect(instance) {
    return {
        type: 'IPFS_CONNECT',
        instance: instance
    };
}
exports.IPFSConnect = IPFSConnect;
//# sourceMappingURL=ipfs.actions.js.map