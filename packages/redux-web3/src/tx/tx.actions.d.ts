import { Action } from "redux";
import { RawTransactionArgumentState, TransactionArgumentState } from "../stateInterface";
export interface TxSendRawAction extends Action {
    signedTx: string;
    web3: any;
    resolvers: any;
}
export declare function TxSendRaw(signedTx: string, web3: any, resolvers: any): TxSendRawAction;
export interface TxSendAction extends Action {
    txArgs: any;
    web3: any;
    resolvers: any;
}
export declare function TxSend(txArgs: TransactionArgumentState, web3: any, resolvers: any): TxSendAction;
export interface TxBroadcastedAction extends Action {
    txHash: string;
    txArgs: TransactionArgumentState | RawTransactionArgumentState;
}
export declare function TxBroadcasted(txHash: string, txArgs: TransactionArgumentState | RawTransactionArgumentState): TxBroadcastedAction;
export interface TxReceiptTxArgs {
    from?: string;
    gas?: string;
    gasPrice?: string;
    data?: string;
    nonce?: number;
    to?: string;
    value?: string;
}
export interface TxReceiptAction extends Action {
    txHash: string;
    receipt: any;
    txArgs: TxReceiptTxArgs;
}
export declare function TxReceipt(txHash: string, receipt: any, txArgs: TxReceiptTxArgs): TxReceiptAction;
export interface TxConfirmedAction extends Action {
    txHash: string;
    confirmationReceipt: any;
    confirmationCount: number;
}
export declare function TxConfirmed(txHash: string, confirmationReceipt: any, confirmationCount: number): TxConfirmedAction;
export interface TxErrorAction extends Action {
    txHash: string;
    error: any;
}
export declare function TxError(txHash: string, error: any): TxErrorAction;
export declare type TxActions = TxBroadcastedAction | TxReceiptAction | TxConfirmedAction | TxErrorAction;
