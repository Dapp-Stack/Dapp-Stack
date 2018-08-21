import { Action } from "redux";
import { AccountConfigState } from "../stateInterface";
export interface AccountAddAction extends Action {
    address: string;
    coinbase: boolean;
}
export declare const AccountAdd: (address: string, coinbase?: boolean) => AccountAddAction;
export interface AccountRemoveAction extends Action {
    address: string;
}
export declare const AccountRemove: (address: string) => AccountRemoveAction;
export interface AccountUpdateAction extends Action {
    address: string;
    balance: string;
    coinbase: boolean;
}
export declare const AccountUpdate: (address: string, balance: string, coinbase?: boolean) => AccountUpdateAction;
export interface AccountErrorAction extends Action {
    address: string;
    error: any;
}
export declare const AccountError: (address: string, error: any) => AccountErrorAction;
export interface AccountConfigAction extends Action, AccountConfigState {
}
export declare const AccountConfig: (config: AccountConfigState) => AccountConfigAction;
export interface AccountUpdateRequestAction extends Action {
    address: string;
}
export declare const AccountUpdateRequest: (address: string) => AccountUpdateRequestAction;
export declare type AccountActions = AccountAddAction | AccountRemoveAction | AccountUpdateAction | AccountErrorAction | AccountConfigAction;
