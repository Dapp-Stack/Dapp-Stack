import {TxBroadcasted, TxConfirmed, TxReceipt, TxError} from "./tx.actions";
import {tx} from "./tx.reducers";

declare var describe: any;
declare var test: any;
declare var expect: any;

let state = undefined;
const txHash = "0xabcd";
const txReceipt = {salut: 'test'};
const txConfCount = 2;

describe('Transaction Reducers', () => {

    test('TxBroadcasted', () => {
        state = tx(state, TxBroadcasted(txHash, {from: "0xme"}));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('BROADCASTED');
    });

    test('TxConfirmed', () => {
        state = tx(state, TxConfirmed(txHash, txReceipt, txConfCount));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].status.transaction_receipt.salut).toBe('test');
        expect(state[txHash].status.transaction_confirmation_count).toBe(txConfCount);
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('CONFIRMED');
    });

    test('TxReceipt', () => {
        state = tx(state, TxReceipt(txHash, txReceipt));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].status.transaction_receipt.salut).toBe('test');
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('RECEIPT');
    });

    test('TxError', () => {
        state = tx(state, TxError(txHash, txReceipt));
        expect(state[txHash].status.transaction_hash).toBe(txHash);
        expect(state[txHash].status.error.salut).toBe('test');
        expect(state[txHash].transaction_arguments.from).toBe('0xme');
        expect(state[txHash].status.type).toBe('ERROR');
    });

});
