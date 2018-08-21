import {Action} from 'redux';

export interface BacklinkConnectAction extends Action {
    url: string
}

export const BacklinkConnect = (url: string): BacklinkConnectAction => {
    return {
        type: 'BACKLINK_CONNECT',
        url
    } as BacklinkConnectAction;
};

export interface BacklinkConnectedAction extends Action {
    instance: any,
    url: string
}

export const BacklinkConnected = (instance: any, url: string): BacklinkConnectedAction => {
    return {
        type: 'BACKLINK_CONNECTED',
        instance,
        url
    } as BacklinkConnectedAction;
};

export interface BacklinkErrorAction extends Action {
    error: any
}

export const BacklinkError = (error: any): BacklinkErrorAction => {
    return {
        type: 'BACKLINK_ERROR',
        error
    } as BacklinkErrorAction;
};

export interface BacklinkDisconnectAction extends Action {}

export const BacklinkDisconnect = (): BacklinkDisconnectAction => {
    return {
        type: 'BACKLINK_DISCONNECT'
    } as BacklinkDisconnectAction;
};

export interface BacklinkDisconnectedAction extends Action {}

export const BacklinkDisconnected = (): BacklinkDisconnectedAction => {
    return {
        type: 'BACKLINK_DISCONNECTED'
    } as BacklinkDisconnectedAction;
};

export interface BacklinkDisableAction extends Action {}

export const BacklinkDisable = (): BacklinkDisableAction => {
    return {
        type: 'BACKLINK_DISABLE'
    } as BacklinkDisableAction;
};

export interface BacklinkCreateHookAction extends Action {
    address: string,
    from: boolean,
    to: boolean,
    trigger: (tx: any, dispatch: (arg: any) => void) => void
}

export const BacklinkCreateHook = (address: string, from: boolean, to: boolean, trigger: (tx: any, dispatch: (arg: any) => void) => void): BacklinkCreateHookAction => {
    return {
        type: 'BACKLINK_CREATE_HOOK',
        address,
        from,
        to,
        trigger
    } as BacklinkCreateHookAction;
};

export interface BacklinkRemoveHookAction extends Action {
    address: string
}

export const BacklinkRemoveHook = (address: string): BacklinkRemoveHookAction => {
    return {
        type: 'BACKLINK_REMOVE_HOOK',
        address
    }
};

export interface BacklinkNewBlockEventAction extends Action {
    block: any
}

export const BacklinkNewBlockEvent = (block: any): BacklinkNewBlockEventAction => {
    return {
        type: 'BACKLINK_NEW_BLOCK_EVENT',
        block
    } as BacklinkNewBlockEventAction;
};

export type BacklinkActions = BacklinkConnectAction | BacklinkConnectedAction | BacklinkErrorAction | BacklinkDisconnectAction | BacklinkDisconnectedAction | BacklinkDisableAction | BacklinkCreateHookAction | BacklinkRemoveHookAction | BacklinkNewBlockEventAction;
