"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function FeedNewTransaction(txHash) {
    return ({
        type: 'FEED_NEW_TRANSACTION',
        txHash: txHash
    });
}
exports.FeedNewTransaction = FeedNewTransaction;
function FeedNewContract(contractName, address) {
    return ({
        type: 'FEED_NEW_CONTRACT',
        contractName: contractName,
        address: address
    });
}
exports.FeedNewContract = FeedNewContract;
function FeedNewError(reason, message, when) {
    return {
        type: 'FEED_NEW_ERROR',
        reason: reason,
        message: message,
        when: when
    };
}
exports.FeedNewError = FeedNewError;
function FeedNewAccount(account, coinbase) {
    return {
        type: 'FEED_NEW_ACCOUNT',
        account: account,
        coinbase: coinbase
    };
}
exports.FeedNewAccount = FeedNewAccount;
function FeedNewIPFSContent(ipfs_hash) {
    return {
        type: 'FEED_NEW_IPFS_CONTENT',
        ipfs_hash: ipfs_hash
    };
}
exports.FeedNewIPFSContent = FeedNewIPFSContent;
//# sourceMappingURL=feed.actions.js.map