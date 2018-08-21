"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function TxSendRaw(signedTx, web3, resolvers) {
    return {
        type: 'TX_SEND_RAW',
        signedTx: signedTx,
        web3: web3,
        resolvers: resolvers
    };
}
exports.TxSendRaw = TxSendRaw;
function TxSend(txArgs, web3, resolvers) {
    return {
        type: 'TX_SEND',
        txArgs: txArgs,
        web3: web3,
        resolvers: resolvers
    };
}
exports.TxSend = TxSend;
function TxBroadcasted(txHash, txArgs) {
    return ({
        type: 'TX_BROADCASTED',
        txHash: txHash,
        txArgs: txArgs
    });
}
exports.TxBroadcasted = TxBroadcasted;
function TxReceipt(txHash, receipt, txArgs) {
    return ({
        type: 'TX_RECEIPT',
        txHash: txHash,
        receipt: receipt,
        txArgs: txArgs
    });
}
exports.TxReceipt = TxReceipt;
function TxConfirmed(txHash, confirmationReceipt, confirmationCount) {
    return ({
        type: 'TX_CONFIRMED',
        txHash: txHash,
        confirmationReceipt: confirmationReceipt,
        confirmationCount: confirmationCount
    });
}
exports.TxConfirmed = TxConfirmed;
function TxError(txHash, error) {
    return ({
        type: 'TX_ERROR',
        txHash: txHash,
        error: error
    });
}
exports.TxError = TxError;
//# sourceMappingURL=tx.actions.js.map