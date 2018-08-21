import { Action } from 'redux';
export interface BacklinkConnectAction extends Action {
    url: string;
}
export declare const BacklinkConnect: (url: string) => BacklinkConnectAction;
export interface BacklinkConnectedAction extends Action {
    instance: any;
    url: string;
}
export declare const BacklinkConnected: (instance: any, url: string) => BacklinkConnectedAction;
export interface BacklinkErrorAction extends Action {
    error: any;
}
export declare const BacklinkError: (error: any) => BacklinkErrorAction;
export interface BacklinkDisconnectAction extends Action {
}
export declare const BacklinkDisconnect: () => BacklinkDisconnectAction;
export interface BacklinkDisconnectedAction extends Action {
}
export declare const BacklinkDisconnected: () => BacklinkDisconnectedAction;
export interface BacklinkDisableAction extends Action {
}
export declare const BacklinkDisable: () => BacklinkDisableAction;
export interface BacklinkCreateHookAction extends Action {
    address: string;
    from: boolean;
    to: boolean;
    trigger: (tx: any, dispatch: (arg: any) => void) => void;
}
export declare const BacklinkCreateHook: (address: string, from: boolean, to: boolean, trigger: (tx: any, dispatch: (arg: any) => void) => void) => BacklinkCreateHookAction;
export interface BacklinkRemoveHookAction extends Action {
    address: string;
}
export declare const BacklinkRemoveHook: (address: string) => BacklinkRemoveHookAction;
export interface BacklinkNewBlockEventAction extends Action {
    block: any;
}
export declare const BacklinkNewBlockEvent: (block: any) => BacklinkNewBlockEventAction;
export declare type BacklinkActions = BacklinkConnectAction | BacklinkConnectedAction | BacklinkErrorAction | BacklinkDisconnectAction | BacklinkDisconnectedAction | BacklinkDisableAction | BacklinkCreateHookAction | BacklinkRemoveHookAction | BacklinkNewBlockEventAction;
