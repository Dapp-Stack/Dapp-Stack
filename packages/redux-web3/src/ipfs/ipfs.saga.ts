import {call, put, take, takeEvery, select} from 'redux-saga/effects';
import {SagaIterator, eventChannel, END} from "redux-saga";
import {IPFSConnect, IPFSError, IPFSLoadAction, IPFSLoaded} from "./ipfs.actions";
import * as IPFSApi from 'ipfs-api';
import {FeedNewError, FeedNewIPFSContent} from "../feed/feed.actions";
import {Web3LoadedAction} from "../..";
import * as IsIPFS from 'is-ipfs';

function* IPFSFetchData(action: IPFSLoadAction): SagaIterator {
    const config = (yield select()).ipfs.config;
    return eventChannel((emit: (arg: any) => void) => {
        config.instance.files.get(action.hash).then((result: any) => {
            for (let idx = 0; idx < result.length; ++idx) {
                if (result[idx].content) {
                    emit(IPFSLoaded(action.hash, result[idx].content));
                } else {
                    emit(IPFSLoaded(result[idx].path, null));
                }
                emit(FeedNewIPFSContent(action.hash));
            }
            emit(END);
        }).catch((e: any) => {
            emit(IPFSError(action.hash, e));
            emit(FeedNewError(e, e.message, "[ipfs.saga.ts][IPFSFetchData] Trying to fetch ipfs hash " + action.hash));
            emit(END);
        });
        return ((): void => {})
    });
}

function* onLoadRequest(action: IPFSLoadAction): SagaIterator {
    const ipfs = (yield select()).ipfs;
    const config = ipfs.config;
    if (!config.active) {
        yield put(FeedNewError(new Error("IPFS not active"), "IPFS not active", "[ipfs.saga.ts][IPFSFetchData] Trying to fetch ipfs hash " + action.hash));
        return ;
    }
    if (!action.hash || !IsIPFS.multihash(action.hash)) {
        yield put(FeedNewError(new Error("Invalid IPFS Hash " + action.hash), "Invalid IPFS Hash " + action.hash, "[ipfs.saga.ts][onLoadRequest] Trying to fetch ipfs hash " + action.hash));
        return ;
    }
    const exists = ipfs[action.hash];
    if (exists && exists.content)
        return ;

    const fetch = yield call(IPFSFetchData, action);

    try {
        while (true) {
            const event = yield take(fetch);
            yield put(event);
        }
    } finally {
        fetch.close();
    }
}

function* initializeRequest(action: Web3LoadedAction): SagaIterator {
    const ipfs_config = (yield select()).ipfs.config;

    if (ipfs_config.config) {
        try {
            const IPFS = IPFSApi(ipfs_config.config.host, ipfs_config.config.port, ipfs_config.config.options);
            yield put(IPFSConnect(IPFS));
        } catch (e) {
            console.warn("[IPFS] Error while trying to connect to provided endpoint");
        }

    }
}

export function* IPFSSagas(): any {
    yield takeEvery('LOAD_WEB3', initializeRequest);
    yield takeEvery('IPFS_LOAD', onLoadRequest)
}
