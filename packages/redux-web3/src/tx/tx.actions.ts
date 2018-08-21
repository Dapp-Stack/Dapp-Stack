import {Action} from "redux";
import {RawTransactionArgumentState, TransactionArgumentState} from "../stateInterface";

export interface TxSendRawAction extends Action {
    signedTx: string,
    web3: any,
    resolvers: any
}

export function TxSendRaw(signedTx: string, web3: any, resolvers: any): TxSendRawAction {
    return {
        type: 'TX_SEND_RAW',
        signedTx,
        web3,
        resolvers
    } as TxSendRawAction;
}

export interface TxSendAction extends Action {
    txArgs: any,
    web3: any,
    resolvers: any
}

export function TxSend(txArgs: TransactionArgumentState, web3: any, resolvers: any): TxSendAction {
    return {
        type: 'TX_SEND',
        txArgs,
        web3,
        resolvers
    } as TxSendAction;
}

export interface TxBroadcastedAction extends Action {
    txHash: string,
    txArgs: TransactionArgumentState | RawTransactionArgumentState
}

export function TxBroadcasted(txHash: string, txArgs: TransactionArgumentState | RawTransactionArgumentState): TxBroadcastedAction {
    return ({
        type: 'TX_BROADCASTED',
        txHash,
        txArgs
    });
}

export interface TxReceiptTxArgs {
    from?: string,
    gas?: string,
    gasPrice?: string,
    data?: string,
    nonce?: number,
    to?: string,
    value?: string
}

export interface TxReceiptAction extends Action {
    txHash: string,
    receipt: any,
    txArgs: TxReceiptTxArgs
}

export function TxReceipt(txHash: string, receipt: any, txArgs: TxReceiptTxArgs): TxReceiptAction {
    return ({
        type: 'TX_RECEIPT',
        txHash,
        receipt,
        txArgs
    });
}

export interface TxConfirmedAction extends Action {
    txHash: string,
    confirmationReceipt: any,
    confirmationCount: number
}

export function TxConfirmed(txHash: string, confirmationReceipt: any, confirmationCount: number): TxConfirmedAction {
    return ({
        type: 'TX_CONFIRMED',
        txHash,
        confirmationReceipt,
        confirmationCount
    });
}

export interface TxErrorAction extends Action {
    txHash: string,
    error: any
}

export function TxError(txHash: string, error: any): TxErrorAction {
    return ({
        type: 'TX_ERROR',
        txHash,
        error
    });
}

export type TxActions = TxBroadcastedAction | TxReceiptAction | TxConfirmedAction | TxErrorAction;
