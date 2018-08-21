import {TxBroadcasted, TxConfirmed, TxReceipt, TxError, TxSend, TxSendRaw} from "./tx.actions";

declare var describe: any;
declare var test: any;
declare var expect: any;

const txHash = "0xabcd";
const txReceipt = {salut: 'test'};
const txConfCount = 2;
const txArgs = {from: "me"};
const web3 = {eth: 'here'};
const resolvers = {success: 'yes'};
const signed = "YESYES";

describe("Transaction Actions", () => {

    test("TxBroadcasted", () => {
        const ret = TxBroadcasted(txHash);
        expect(ret.type).toBe('TX_BROADCASTED');
        expect(ret.txHash).toBe(txHash);
    });

    test("TxConfirmed", () => {
        const ret = TxConfirmed(txHash, txReceipt, txConfCount);
        expect(ret.type).toBe('TX_CONFIRMED');
        expect(ret.txHash).toBe(txHash);
        expect(ret.confirmationReceipt.salut).toBe('test');
        expect(ret.confirmationCount).toBe(txConfCount);
    });

    test("TxReceipt", () => {
        const ret = TxReceipt(txHash, txReceipt);
        expect(ret.type).toBe('TX_RECEIPT');
        expect(ret.receipt.salut).toBe('test');
        expect(ret.txHash).toBe(txHash);
    });

    test("TxError", () => {
        const ret = TxError(txHash, txReceipt);
        expect(ret.type).toBe('TX_ERROR');
        expect(ret.error.salut).toBe('test');
        expect(ret.txHash).toBe(ret.txHash);
    });

    test("TxSend", () => {
        const ret = TxSend(txArgs, web3, resolvers);
        expect(ret.type).toBe('TX_SEND');
        expect(ret.web3.eth).toBe('here');
        expect(ret.resolvers.success).toBe('yes');
        expect(ret.txArgs.from).toBe('me');
    });

    test("TxSendRaw", () => {
        const ret = TxSendRaw(signed, web3, resolvers);
        expect(ret.type).toBe('TX_SEND_RAW');
        expect(ret.web3.eth).toBe('here');
        expect(ret.resolvers.success).toBe('yes');
        expect(ret.signedTx).toBe('YESYES');
    });

});