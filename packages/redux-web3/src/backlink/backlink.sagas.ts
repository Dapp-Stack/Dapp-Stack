import {call, put, take, takeEvery, takeLatest, select} from 'redux-saga/effects';
import {SagaIterator, eventChannel, END} from "redux-saga";
import {AccountAddAction, AccountUpdateRequest, ContractLoadedAction, FeedNewError, Web3LoadedAction} from "../..";
import * as Web3 from 'web3';
import {
    BacklinkConnected,
    BacklinkCreateHook,
    BacklinkError,
    BacklinkNewBlockEvent,
    BacklinkNewBlockEventAction
} from "./backlink.actions";
import {Unsubscribe} from "redux";
import {BacklinkHookState, BacklinkState} from "../stateInterface";
import {ContractCompleteRefresh} from "../contracts/contracts.actions";
import {Web3BacklinkLoaded} from "../web3/web3.actions";
const networkNames = {
    1: 'mainnet',
    3: 'ropsten',
    42: 'kovan',
    4: 'rinkeby'
};

function *updateManager(action: Web3LoadedAction, backlink: BacklinkState): SagaIterator {
    return eventChannel((emit: (arg?: any)=> void): Unsubscribe => {

        let instance;
        action._.eth.net.getId().then((id: number): void => {
            let url;
            url = backlink.config.url[id] || backlink.config.url[networkNames[id]];
            if (!url && backlink.config.url["default"]) {
                url = backlink.config.url["default"];
            }
            instance = new (<any>Web3)(new (<any>Web3).providers.WebsocketProvider(url));
            emit(BacklinkConnected(instance, url));
            emit(Web3BacklinkLoaded(action._, action.networkId, action.coinbase));

            try {
                instance.eth.subscribe('newBlockHeaders', (error: Error, result: any): void => {
                    if (error) {
                        emit(BacklinkError(error));
                        emit(FeedNewError(error, error.message, "[backlink.sagas.ts][updateManager] Error during run"));
                        emit(END);
                    } else {
                        emit(BacklinkNewBlockEvent(result));
                    }
                })
            } catch (e) {
                emit(BacklinkError(e));
                emit(FeedNewError(e, e.message, "[backlink.sagas.ts][updateManager] Error during run"));
                emit(END);
            }


        }).catch((e: Error) => {
            emit(BacklinkError(e));
            emit(FeedNewError(e, e.message, "[backlink.sagas.ts][networkCheckLoading] Trying to initialize backlink"));
            emit(END);
        });
        return ((): void => {
            if (instance) {
                instance.eth.clearSubscriptions();
            }
        });
    })
}

function* onBacklinkInit(action: Web3LoadedAction): SagaIterator {
    const backlink = (yield select()).backlink;
    switch (backlink.status) {
        default:
        case 'LOADING':
            try {
                const networkCheckChannel = yield call(updateManager, action, backlink);
                try {
                    while (true) {
                        const event = yield take(networkCheckChannel);
                        yield put(event);
                    }
                } finally {
                    networkCheckChannel.close();
                }
            } catch (e) {
                console.error(e);
                yield put(FeedNewError(e, e.message, "[backlink.sagas.ts][onBacklinkInit] Trying to initialize backlink"));
            }
            break ;
        case 'DISABLED':
            console.warn("[backlink.sagas.ts][onBacklinkInit] Disabled status for Backlink");
            yield put(Web3BacklinkLoaded(action._, action.networkId, action.coinbase));
            return ;
    }
}

function* onNewContract(action: ContractLoadedAction): SagaIterator {
    yield put(BacklinkCreateHook(action.contractAddress, false, true, (arg: any, dispatch: any): void => {
        dispatch(ContractCompleteRefresh(action.contractName, action.contractAddress));
    }));
}

function* onNewAccount(action: AccountAddAction): SagaIterator {
    yield put(BacklinkCreateHook(action.address, true, true, (arg: any, dispatch: any): void => {
        dispatch(AccountUpdateRequest(action.address));
    }));
}

function recursiveBackwardFetcher(web3: any, block: any, height: number, depth: number, emit: (arg?: any) => void, hooks: BacklinkHookState, dispatch: (arg: any) => void): void {
    if (!Object.keys(hooks).length) {
        emit(END)
    } else if (!block) {
        web3.eth.getBlock(height, true)
            .then((_block: any) => {
                if (_block && _block.transactions) {
                    recursiveBackwardFetcher(web3, _block, height, depth, emit, hooks, dispatch);
                } else if (depth && height >= 1) {
                    recursiveBackwardFetcher(web3, null, height - 1, depth - 1, emit, hooks, dispatch);
                } else {
                    const msg = "Unable to fetch Block";
                    emit(FeedNewError(new Error(msg), msg, "[backlink.sagas.ts][recursiveBackwardFetcher] Trying to fetch block"));
                    emit(END);
                }
            })
            .catch((_error: Error) => {
                if (depth && height >= 1) {
                    recursiveBackwardFetcher(web3, null, height - 1, depth - 1, emit, hooks, dispatch);
                } else {
                    emit(FeedNewError(_error, _error.message, "[backlink.sagas.ts][recursiveBackwardFetcher] Trying to fetch block"));
                    emit(END);
                }
            })
    } else {
        for (let tx_idx = 0; tx_idx < block.transactions.length; ++tx_idx) {
            let {from, to}: {from: string, to: string} = block.transactions[tx_idx];
            from = from.toLowerCase();
            to = to.toLowerCase();
            if (hooks[from] && hooks[from].length) {
                for (let from_idx = 0; from_idx < hooks[from].length; ++from_idx) {
                    if (hooks[from][from_idx].from) {
                        hooks[from][from_idx].trigger(block.transactions[tx_idx], dispatch);
                    }
                }
            }
            if (hooks[to] && hooks[to].length) {
                for (let to_idx = 0; to_idx < hooks[to].length; ++to_idx) {
                    if (hooks[to][to_idx].to) {
                        hooks[to][to_idx].trigger(block.transactions[tx_idx], dispatch);
                    }
                }
            }
        }
        emit(END);
    }
}

function* fetchBlockCallTriggers(height: number, dispatch: (arg: any) => void): SagaIterator {
    const state = (yield select());
    if (state.backlink.status === 'CONNECTED') {
        const instance = state.backlink.instance;
        return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
            recursiveBackwardFetcher(instance, null, height, 5, emit, state.backlink.hooks, dispatch);
            return ((): void => {

            })
        })
    } else {
        return undefined;
    }
}

function* onNewBlock(dispatch: (arg: any) => void, action: BacklinkNewBlockEventAction): SagaIterator {
    if (action.block.number) {
        const fetcher = yield call(fetchBlockCallTriggers, action.block.number, dispatch);

        if (fetcher) {
            try {
                while (true) {
                    const event = yield take(fetcher);
                    yield put(event);
                }
            } finally {
                fetcher.close();
            }
        }

    }
}

export function* BacklinkSagas(dispatch: (arg: any) => void): any {
    yield takeLatest('LOADED_WEB3', onBacklinkInit);
    yield takeEvery('CONTRACT_LOADED', onNewContract);
    yield takeEvery('ACCOUNT_ADD', onNewAccount);
    const boundOnNewBlock = onNewBlock.bind(null, dispatch);
    yield takeEvery('BACKLINK_NEW_BLOCK_EVENT', boundOnNewBlock);
}
