import {Action} from 'redux';

export interface IPFSLoadAction extends Action {
    hash: string
}

export function IPFSLoad(hash: string): IPFSLoadAction {
    return {
        type: 'IPFS_LOAD',
        hash
    };
}

export interface IPFSLoadedAction extends Action {
    hash: string,
    content: any
}

export function IPFSLoaded(hash: string, content: any): IPFSLoadedAction {
    return {
        type: 'IPFS_LOADED',
        hash,
        content
    };
}

export interface IPFSErrorAction extends Action {
    hash: string,
    reason: any
}

export function IPFSError(hash: string, reason: any): IPFSErrorAction {
    return {
        type: 'IPFS_ERROR',
        hash,
        reason
    };
}

export interface IPFSConnectAction extends Action {
    instance: any
}

export function IPFSConnect(instance: any): IPFSConnectAction {
    return {
        type: 'IPFS_CONNECT',
        instance
    };
}

export type IPFSActions = IPFSLoadAction | IPFSLoadedAction | IPFSErrorAction | IPFSConnectAction;
