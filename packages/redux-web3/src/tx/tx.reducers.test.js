"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tx_actions_1 = require("./tx.actions");
var tx_reducers_1 = require("./tx.reducers");
var state = undefined;
var txHash = "0xabcd";
var txReceipt = { salut: 'test' };
var txConfCount = 2;
describe('Transaction Reducers', function () {
    test('TxBroadcasted', function () {
        state = tx_reducers_1.tx(state, tx_actions_1.TxBroadcasted(txHash, { from: "0xme" }));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('BROADCASTED');
    });
    test('TxConfirmed', function () {
        state = tx_reducers_1.tx(state, tx_actions_1.TxConfirmed(txHash, txReceipt, txConfCount));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].status.transaction_receipt.salut).toBe('test');
        expect(state[txHash].status.transaction_confirmation_count).toBe(txConfCount);
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('CONFIRMED');
    });
    test('TxReceipt', function () {
        state = tx_reducers_1.tx(state, tx_actions_1.TxReceipt(txHash, txReceipt));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].status.transaction_receipt.salut).toBe('test');
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('RECEIPT');
    });
    test('TxError', function () {
        state = tx_reducers_1.tx(state, tx_actions_1.TxError(txHash, txReceipt));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].status.error.salut).toBe('test');
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('ERROR');
    });
});
//# sourceMappingURL=tx.reducers.test.js.map