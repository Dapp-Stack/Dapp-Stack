import { Action } from "redux";
export interface Web3LoadAction extends Action {
    loader: Promise<any>;
    networks: number[];
}
export declare function Web3Load(loader: Promise<any>, networks: number[]): Web3LoadAction;
export interface Web3LoadedAction extends Action {
    _: any;
    networkId: number | string;
    coinbase: string;
}
export declare function Web3Loaded(_: any, networkId: number | string, coinbase: string): Web3LoadedAction;
export interface Web3BacklinkLoadedAction extends Action {
    _: any;
    networkId: number | string;
    coinbase: string;
}
export declare function Web3BacklinkLoaded(_: any, networkId: number | string, coinbase: string): Web3BacklinkLoadedAction;
export interface Web3LoadErrorAction extends Action {
    error: any;
}
export declare function Web3LoadError(error: any): Web3LoadErrorAction;
export interface Web3NetworkErrorAction extends Action {
    networkId: number | string;
}
export declare function Web3NetworkError(networkId: number | string): Web3NetworkErrorAction;
export interface Web3LockedAction extends Action {
}
export declare function Web3Locked(): Web3LockedAction;
export declare type Web3Actions = Web3LoadAction | Web3LoadedAction | Web3LoadErrorAction | Web3NetworkErrorAction | Web3LockedAction | Web3BacklinkLoadedAction;
