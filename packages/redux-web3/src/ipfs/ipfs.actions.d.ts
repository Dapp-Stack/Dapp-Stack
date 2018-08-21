import { Action } from 'redux';
export interface IPFSLoadAction extends Action {
    hash: string;
}
export declare function IPFSLoad(hash: string): IPFSLoadAction;
export interface IPFSLoadedAction extends Action {
    hash: string;
    content: any;
}
export declare function IPFSLoaded(hash: string, content: any): IPFSLoadedAction;
export interface IPFSErrorAction extends Action {
    hash: string;
    reason: any;
}
export declare function IPFSError(hash: string, reason: any): IPFSErrorAction;
export interface IPFSConnectAction extends Action {
    instance: any;
}
export declare function IPFSConnect(instance: any): IPFSConnectAction;
export declare type IPFSActions = IPFSLoadAction | IPFSLoadedAction | IPFSErrorAction | IPFSConnectAction;
