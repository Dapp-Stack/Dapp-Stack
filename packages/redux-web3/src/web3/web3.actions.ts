import {Action} from "redux";

export interface Web3LoadAction extends Action {
    loader: Promise<any>,
    networks: number[]
}

export function Web3Load(loader: Promise<any>, networks: number[]): Web3LoadAction {
    return ({
        type: 'LOAD_WEB3',
        loader,
        networks
    });
}

export interface Web3LoadedAction extends Action {
    _: any,
    networkId: number|string,
    coinbase: string
}

export function Web3Loaded(_: any, networkId: number|string, coinbase: string): Web3LoadedAction {
    return ({
        type: 'LOADED_WEB3',
        _,
        networkId,
        coinbase
    })
}

export interface Web3BacklinkLoadedAction extends Action {
    _: any,
    networkId: number|string,
    coinbase: string
}

export function Web3BacklinkLoaded(_: any, networkId: number|string, coinbase: string): Web3BacklinkLoadedAction {
    return ({
        type: 'LOADED_WEB3_BACKLINK',
        _,
        networkId,
        coinbase
    });
}

export interface Web3LoadErrorAction extends Action {
    error: any
}

export function Web3LoadError(error: any): Web3LoadErrorAction {
    return ({
        type: 'LOAD_ERROR_WEB3',
        error
    })
}

export interface Web3NetworkErrorAction extends Action {
    networkId: number|string
}

export function Web3NetworkError(networkId: number|string): Web3NetworkErrorAction {
    return ({
        type: 'NETWORK_ERROR_WEB3',
        networkId
    })
}

export interface Web3LockedAction extends Action {
}

export function Web3Locked(): Web3LockedAction {
    return ({
        type: 'LOCKED_WEB3'
    })
}

export type Web3Actions = Web3LoadAction | Web3LoadedAction | Web3LoadErrorAction | Web3NetworkErrorAction | Web3LockedAction | Web3BacklinkLoadedAction;
