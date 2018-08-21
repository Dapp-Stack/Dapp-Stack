import {Reducer} from "redux";
import {
    TransactionState,
    TransactionStoreState
} from "../stateInterface";
import {TxActions, TxBroadcastedAction, TxConfirmedAction, TxErrorAction, TxReceiptAction} from "./tx.actions";

export const tx: Reducer<TransactionStoreState, TxActions> = (state: TransactionStoreState = {} as TransactionStoreState, action: TxActions): TransactionStoreState => {

    switch (action.type) {

        case 'TX_BROADCASTED':
            return {
                ...state,
                [(<TxBroadcastedAction>action).txHash]: {
                    ...state[(<TxBroadcastedAction>action).txHash],
                    status: {
                        type: 'BROADCASTED',
                        transaction_hash: (<TxBroadcastedAction>action).txHash,
                        timestamp: Date.now()
                    },
                    transaction_arguments: (<TxBroadcastedAction>action).txArgs
                } as TransactionState
            };

        case 'TX_RECEIPT':
            return {
                ...state,
                [(<TxReceiptAction>action).txHash]: {
                    ...state[(<TxReceiptAction>action).txHash],
                    status: {
                        type: 'RECEIPT',
                        transaction_hash: (<TxReceiptAction>action).txHash,
                        transaction_receipt: (<TxReceiptAction>action).receipt,
                        timestamp: Date.now()
                    },
                    transaction_arguments: {
                        ...state[(<TxReceiptAction>action).txHash].transaction_arguments,
                        ...(<TxReceiptAction>action).txArgs
                    }
                } as TransactionState
            };

        case 'TX_CONFIRMED':
            return {
                ...state,
                [(<TxConfirmedAction>action).txHash]: {
                    ...state[(<TxConfirmedAction>action).txHash],
                    status: {
                        type: 'CONFIRMED',
                        transaction_hash: (<TxConfirmedAction>action).txHash,
                        transaction_receipt: (<TxConfirmedAction>action).confirmationReceipt,
                        transaction_confirmation_count: (<TxConfirmedAction>action).confirmationCount,
                        timestamp: Date.now()
                    }
                } as TransactionState
            };

        case 'TX_ERROR':
            return {
                ...state,
                [(<TxErrorAction>action).txHash]: {
                    ...state[(<TxErrorAction>action).txHash],
                    status: {
                        type: 'ERROR',
                        transaction_hash: (<TxErrorAction>action).txHash,
                        error: (<TxErrorAction>action).error,
                        timestamp: Date.now()
                    }
                } as TransactionState
            };

        default:
            return state;

    }

};
