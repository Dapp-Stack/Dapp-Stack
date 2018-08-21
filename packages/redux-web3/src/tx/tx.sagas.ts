import {call, put, select, take, takeEvery} from 'redux-saga/effects';
import {
    TxBroadcasted,
    TxConfirmed,
    TxError,
    TxReceipt,
    TxSendAction,
    TxSendRawAction
} from "./tx.actions";
import {Vortex} from "../vortex";
import {SagaIterator, eventChannel, END} from "redux-saga";
import {Unsubscribe} from "redux";
import {FeedNewError, FeedNewTransaction} from "../feed/feed.actions";
import {AccountUpdateRequest} from "../accounts/accounts.actions";
import {BN} from 'bn.js';

const toLower: string[] = [
    "to",
    "from",
    "gas",
    "gasPrice",
    "value"
];

function* sendTransaction(action: TxSendAction): SagaIterator {
    let transaction_hash: string;
    const state = yield select();

    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        let _transactionEvents = undefined;
        try {
            _transactionEvents = action.web3.eth.sendTransaction(action.txArgs)
                .on('transactionHash', (_transaction_hash: string): void => {
                    transaction_hash = _transaction_hash;
                    if (action.resolvers) {
                        action.resolvers.success(_transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(FeedNewTransaction(_transaction_hash));
                    Object.keys(action.txArgs).forEach((key: string): void => {
                        if (toLower.indexOf(key) !== -1) {
                            action.txArgs[key] = action.txArgs[key].toLowerCase();
                        }
                    });
                    emit(TxBroadcasted(_transaction_hash, action.txArgs));
                })
                .on('confirmation', (_amount: number, _receipt: any): void => {
                    emit(TxConfirmed(transaction_hash, _receipt, _amount));
                    if (state.backlink.status !== 'CONNECTED' && state.backlink.status !== 'LOADING') {
                        if (!(_amount % 5) || _amount < 5) {
                            if (action.txArgs.from)
                                emit(AccountUpdateRequest(action.txArgs.from));
                            if (action.txArgs.to)
                                emit(AccountUpdateRequest(action.txArgs.to));
                        }
                    }
                    if (_amount >= 24)
                        emit(END);
                })
                .on('receipt', (_receipt: any): void => {
                    action.web3.eth.getTransaction(transaction_hash).then((txInfos: any): void => {
                        Vortex.get().Store.dispatch(TxReceipt(transaction_hash, _receipt, {
                            from: txInfos.from.toLowerCase(),
                            to: txInfos.to.toLowerCase(),
                            gas: '0x' + (new BN(txInfos.gas)).toString(16).toLowerCase(),
                            gasPrice: '0x' + (new BN(txInfos.gasPrice)).toString(16).toLowerCase(),
                            data: txInfos.input,
                            nonce: txInfos.nonce,
                            value: '0x' + (new BN(txInfos.value)).toString(16).toLowerCase()
                        }));
                    });
                })
                .on('error', (_error: any): void => {
                    if (transaction_hash === undefined) {
                        transaction_hash = 'last';
                    }
                    emit(TxError(transaction_hash, _error));
                    emit(FeedNewError(_error, _error.message, "[tx.sagas.ts][sendTransaction] Trying to send a transaction."));
                    if (action.resolvers) {
                        action.resolvers.success(transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(END);
                });
        } catch (reason) {
            if (transaction_hash === undefined) {
                transaction_hash = 'last';
            }
            Vortex.get().Store.dispatch(TxError(transaction_hash, reason));
            Vortex.get().Store.dispatch(FeedNewError(reason, reason.message, "[tx.sagas.ts][sendTransaction] Trying to send a transaction."));
            if (action.resolvers) {
                action.resolvers.error(transaction_hash);
                action.resolvers = undefined;
            }
            emit(END);
        }

        return (): void => {
            if (_transactionEvents)
                _transactionEvents.off();
        }
    });
}

function* callSendTransaction(action: TxSendAction): SagaIterator {
    const tx = yield call(sendTransaction, action);
    try {
        while (true) {
            const event = yield take(tx);
            yield put(event);
        }
    } finally {
        tx.close();
    }
}

function* sendRawTransaction(action: TxSendRawAction): SagaIterator {
    let transaction_hash: string;
    let coinbase: string = (yield select()).web3.coinbase;
    let to: string = undefined;
    let from: string = undefined;

    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        let _transactionEvents = undefined;
        try {
            _transactionEvents = action.web3.eth.sendRawTransaction(action.signedTx)
                .on('transactionHash', (_transaction_hash: string): void => {
                    transaction_hash = _transaction_hash;
                    if (action.resolvers) {
                        action.resolvers.success(_transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(FeedNewTransaction(_transaction_hash));
                    emit(TxBroadcasted(_transaction_hash, {signed_transaction: action.signedTx}));
                })
                .on('confirmation', (_amount: number, _receipt: any): void => {
                    emit(TxConfirmed(transaction_hash, _receipt, _amount));
                    if (!(_amount % 5) || _amount < 5) {
                        if (to) {
                            emit(AccountUpdateRequest(to));
                        }
                        if (from) {
                            emit(AccountUpdateRequest(from));
                        }
                        emit(AccountUpdateRequest(coinbase));
                    }
                    if (_amount >= 24)
                        emit(END);

                })
                .on('receipt', (_receipt: any): void => {
                    action.web3.eth.getTransaction(transaction_hash).then((txInfos: any): void => {
                        from = txInfos.from.toLowerCase();
                        to = txInfos.to.toLowerCase();
                        Vortex.get().Store.dispatch(TxReceipt(transaction_hash, _receipt, {
                            from: txInfos.from.toLowerCase(),
                            to: txInfos.to.toLowerCase(),
                            gas: '0x' + (new BN(txInfos.gas)).toString(16).toLowerCase(),
                            gasPrice: '0x' + (new BN(txInfos.gasPrice)).toString(16).toLowerCase(),
                            data: txInfos.input,
                            nonce: txInfos.nonce,
                            value: '0x' + (new BN(txInfos.value)).toString(16).toLowerCase()
                        }));
                    });
                })
                .on('error', (_error: any): void => {
                    if (transaction_hash === undefined) {
                        transaction_hash = 'last';
                    }
                    emit(TxError(transaction_hash, _error));
                    emit(FeedNewError(_error, _error.message, "[tx.sagas.ts][sendRawTransaction] Trying to send a raw transaction."));
                    if (action.resolvers) {
                        action.resolvers.error(transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(END);
                });
        } catch (reason) {
            if (transaction_hash === undefined) {
                transaction_hash = 'last';
            }
            Vortex.get().Store.dispatch(TxError(transaction_hash, reason));
            Vortex.get().Store.dispatch(FeedNewError(reason, reason.message, "[tx.sagas.ts][sendRawTransaction] Trying to send a raw transaction."));
            if (action.resolvers) {
                action.resolvers.error(transaction_hash);
                action.resolvers = undefined;
            }
            emit(END);
        }

        return (): void => {
            if (_transactionEvents)
                _transactionEvents.off();
        }
    });
}

function* callSendRawTransaction(action: TxSendRawAction): SagaIterator {
    const tx = yield call(sendRawTransaction, action);
    try {
        while (true) {
            const event = yield take(tx);
            yield put(event);
        }
    } finally {
        tx.close();
    }
}
export function* TxSagas(): any {
    yield takeEvery('TX_SEND', callSendTransaction);
    yield takeEvery('TX_SEND_RAW', callSendRawTransaction);
}
