"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Web3Load(loader, networks) {
    return ({
        type: 'LOAD_WEB3',
        loader: loader,
        networks: networks
    });
}
exports.Web3Load = Web3Load;
function Web3Loaded(_, networkId, coinbase) {
    return ({
        type: 'LOADED_WEB3',
        _: _,
        networkId: networkId,
        coinbase: coinbase
    });
}
exports.Web3Loaded = Web3Loaded;
function Web3BacklinkLoaded(_, networkId, coinbase) {
    return ({
        type: 'LOADED_WEB3_BACKLINK',
        _: _,
        networkId: networkId,
        coinbase: coinbase
    });
}
exports.Web3BacklinkLoaded = Web3BacklinkLoaded;
function Web3LoadError(error) {
    return ({
        type: 'LOAD_ERROR_WEB3',
        error: error
    });
}
exports.Web3LoadError = Web3LoadError;
function Web3NetworkError(networkId) {
    return ({
        type: 'NETWORK_ERROR_WEB3',
        networkId: networkId
    });
}
exports.Web3NetworkError = Web3NetworkError;
function Web3Locked() {
    return ({
        type: 'LOCKED_WEB3'
    });
}
exports.Web3Locked = Web3Locked;
//# sourceMappingURL=web3.actions.js.map