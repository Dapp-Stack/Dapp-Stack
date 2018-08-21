"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tx_actions_1 = require("./tx.actions");
var txHash = "0xabcd";
var txReceipt = { salut: 'test' };
var txConfCount = 2;
var txArgs = { from: "me" };
var web3 = { eth: 'here' };
var resolvers = { success: 'yes' };
var signed = "YESYES";
describe("Transaction Actions", function () {
    test("TxBroadcasted", function () {
        var ret = tx_actions_1.TxBroadcasted(txHash);
        expect(ret.type).toBe('TX_BROADCASTED');
        expect(ret.txHash).toBe(txHash);
    });
    test("TxConfirmed", function () {
        var ret = tx_actions_1.TxConfirmed(txHash, txReceipt, txConfCount);
        expect(ret.type).toBe('TX_CONFIRMED');
        expect(ret.txHash).toBe(txHash);
        expect(ret.confirmationReceipt.salut).toBe('test');
        expect(ret.confirmationCount).toBe(txConfCount);
    });
    test("TxReceipt", function () {
        var ret = tx_actions_1.TxReceipt(txHash, txReceipt);
        expect(ret.type).toBe('TX_RECEIPT');
        expect(ret.receipt.salut).toBe('test');
        expect(ret.txHash).toBe(txHash);
    });
    test("TxError", function () {
        var ret = tx_actions_1.TxError(txHash, txReceipt);
        expect(ret.type).toBe('TX_ERROR');
        expect(ret.error.salut).toBe('test');
        expect(ret.txHash).toBe(ret.txHash);
    });
    test("TxSend", function () {
        var ret = tx_actions_1.TxSend(txArgs, web3, resolvers);
        expect(ret.type).toBe('TX_SEND');
        expect(ret.web3.eth).toBe('here');
        expect(ret.resolvers.success).toBe('yes');
        expect(ret.txArgs.from).toBe('me');
    });
    test("TxSendRaw", function () {
        var ret = tx_actions_1.TxSendRaw(signed, web3, resolvers);
        expect(ret.type).toBe('TX_SEND_RAW');
        expect(ret.web3.eth).toBe('here');
        expect(ret.resolvers.success).toBe('yes');
        expect(ret.signedTx).toBe('YESYES');
    });
});
//# sourceMappingURL=tx.actions.test.js.map