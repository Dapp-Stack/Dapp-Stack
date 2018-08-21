import {call, put, take, takeEvery, takeLatest, select} from 'redux-saga/effects';
import {SagaIterator, eventChannel, END} from "redux-saga";
import {
    AccountAdd,
    AccountAddAction,
    AccountError,
    AccountUpdate,
    AccountUpdateRequestAction
} from "./accounts.actions";
import {FeedNewAccount, FeedNewError} from "../feed/feed.actions";
import {Vortex} from "../vortex";
import {AccountConfigState, AccountInfoState, AccountStoreState, Web3LoadedState} from "../stateInterface";

let running: boolean = false;

function fetchAccount(address: string, coinbase: boolean, emit: (arg?: any) => void): Promise<void> {
    return new Promise<void>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
        (<Web3LoadedState>Vortex.get().Store.getState().web3)._.eth.getBalance(address).then((balance: any) => {
            emit(AccountUpdate(address, balance, coinbase));
            ok();
        }).catch((e: Error): void => {
            ko(e);
        });
    });
}

function loopOnAccounts(emit: (arg?: any) => void): Promise<void> {
    return new Promise<void>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
        const refresh_rate: number = (<AccountConfigState>Vortex.get().Store.getState().accounts.configuration).refresh_rate;
        const accounts: AccountStoreState = Vortex.get().Store.getState().accounts;
        setTimeout((): void => {

            Object.keys(accounts).filter((elem: string) => (elem !== 'coinbase' && elem !== 'configuration')).forEach((address: string): void => {
                fetchAccount(address, !!(<AccountInfoState>accounts[address]).coinbase, emit)
                    .then((): void => {
                    })
                    .catch((e: Error): void => {
                        emit(AccountError(address, e));
                        emit(FeedNewError(e, e.message, "[accounts.sagas.ts][loopOnAccounts] Trying to fetch account informations."));
                        ko(e);
                    })
            });

            if (running)
                loopOnAccounts(emit).catch((e: Error): void => {
                    emit(FeedNewError(e, e.message, "[accounts.sagas.ts][loopOnAccounts] Trying to fetch account informations."));
                    ko(e);
                });
        }, refresh_rate);
    })
}

function* refreshLoop(): SagaIterator {

    return eventChannel((emit: (arg?: any)=> void) => {

        running = true;
        loopOnAccounts(emit).catch((e: Error): void => {
            emit(FeedNewError(e, e.message, "[accounts.sagas.ts][loopOnAccounts] Trying to fetch account informations."));
            emit(END);
        });

        return ((): void => {
            running = false;
        });
    });

}

function* onAccountInit(): SagaIterator {


    const state = (yield select());
    const coinbase = state.web3.coinbase;
    yield put(AccountAdd(coinbase, true));
    if (state.backlink.status !== 'CONNECTED' && state.backlink.status !== 'LOADING') {
        const refresh_loop = yield call(refreshLoop);

        try {
            while (true) {
                const event = yield take(refresh_loop);
                yield put(event);
            }
        } finally {
            refresh_loop.close();
        }
    }
}

function *singleFetch(action: AccountAddAction, new_address: boolean, coinbase: boolean): SagaIterator {

    return eventChannel((emit: (arg?: any) => void) => {

        fetchAccount(action.address.toLowerCase(), coinbase, emit).then((): void => {
            if (new_address) {
                emit(FeedNewAccount(action.address.toLowerCase(), coinbase));
            }
            emit(END);
        }).catch((e: Error): void => {
            emit(AccountError(action.address.toLowerCase(), e));
            emit(FeedNewError(e, e.message, "[accounts.sagas.ts][singleFetch] Trying to fetch account informations."));
            emit(END);
        });

        return ((): void => {

        });
    });
}

function *onAccountAdd(action: AccountAddAction): SagaIterator {
    const add = yield call(singleFetch, action, true, action.coinbase);
    try {
        while (true) {
            const event = yield take(add);
            yield put(event);
        }
    } finally {
        add.close();
    }
}

function *onUpdateRequest(action: AccountUpdateRequestAction): SagaIterator {
    const accounts = (yield select()).accounts;
    if (accounts[action.address]) {
        const add = yield call(singleFetch, action, false, !!(<AccountInfoState>accounts[action.address]).coinbase);
        try {
            while (true) {
                const event = yield take(add);
                yield put(event);
            }
        } finally {
            add.close();
        }
    }
}

export function* AccountSagas(): any {
    yield takeLatest('LOADED_WEB3_BACKLINK', onAccountInit);
    yield takeEvery('ACCOUNT_ADD', onAccountAdd);
    yield takeEvery('ACCOUNT_UPDATE_REQUEST', onUpdateRequest);
}

