import {call, put, take, takeLatest, select} from 'redux-saga/effects';
import {Unsubscribe} from "redux";
import {
    Web3LoadAction,
    Web3Loaded,
    Web3LoadError,
    Web3Locked,
    Web3NetworkError
} from "./web3.actions";
import {SagaIterator, eventChannel, END} from "redux-saga";
import {TxSend, TxSendRaw} from "../tx/tx.actions";
import {Vortex} from "../vortex";

function* resolveWeb3(action: Web3LoadAction): SagaIterator {
    const state = (yield select());
    const config = state.contracts.config;
    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {

        action.loader.then((web3: any): void => {

            web3.eth.vortexSendRawTransaction = (signedTx: string): any => {
                let resolvers = {};
                let differed_return: Promise<string> = new Promise<string>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
                    (<any>resolvers).success = ok;
                    (<any>resolvers).error = ko;
                });
                Vortex.get().Store.dispatch(TxSendRaw(signedTx, web3, resolvers));
                return differed_return;
            };

            web3.eth.vortexSendTransaction = (txArgs: any): any => {
                let resolvers = {};
                let differed_return: Promise<string> = new Promise<string>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
                    (<any>resolvers).success = ok;
                    (<any>resolvers).error = ko;
                });
                Vortex.get().Store.dispatch(TxSend(txArgs, web3, resolvers));
                return differed_return;
            };

            switch (config.type) {
                case 'manual':
                case 'truffle':
                    web3.eth.getCoinbase().then((coinbase: string): void => {
                        if (!coinbase || coinbase === "") {
                            emit(Web3Locked());
                            emit(END);
                        } else {
                            web3.eth.net.getId().then((network_id: number): void => {
                                if ((action.networks) && (action.networks.length) && (action.networks.indexOf(network_id) === -1)) {
                                    emit(Web3NetworkError(network_id));
                                    emit(END);
                                } else {
                                    emit(Web3Loaded(web3, network_id, coinbase));
                                    emit(END);
                                }
                            }).catch((reason: Error): void => {
                                emit(Web3LoadError(reason));
                                emit(END);
                            });
                        }
                    }).catch((reason: Error): void => {
                        emit(Web3LoadError(reason));
                        emit(END);
                    });
                    break ;
                case 'embark':
                    web3.eth.getCoinbase().then((coinbase: string): void => {
                        if (!coinbase || coinbase === "") {
                            emit(Web3Locked());
                            emit(END);
                        } else {
                            web3.eth.getBlock(0).then((zero: any): void => {
                                if (!config.config.chains[zero.hash]) {
                                    emit(Web3NetworkError(zero.hash));
                                    emit(END);
                                } else {
                                    emit(Web3Loaded(web3, zero.hash, coinbase));
                                    emit(END);
                                }
                            }).catch((reason: Error): void => {
                                emit(Web3LoadError(reason));
                                emit(END);
                            });
                        }
                    }).catch((reason: Error): void => {
                        emit(Web3LoadError(reason));
                        emit(END);
                    });
                    break ;
            }
        }).catch((reason: any): void => {
            emit(Web3LoadError(reason));
            emit(END);
        });

        return ((): void => {}) as Unsubscribe;

    });

}

function* callResolveWeb3(action: Web3LoadAction): SagaIterator {
    const web3 = yield call(resolveWeb3, action);
    try {
        while (true) {
            const event = yield take(web3);
            yield put(event)
        }
    } finally {
        web3.close()
    }
}

export function* Web3Sagas(): any {
    yield takeLatest('LOAD_WEB3', callResolveWeb3);
}
