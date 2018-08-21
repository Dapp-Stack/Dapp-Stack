import {Action} from "redux";
import {AccountConfigState} from "../stateInterface";

export interface AccountAddAction extends Action {
    address: string,
    coinbase: boolean
}

export const AccountAdd = (address: string, coinbase: boolean = false): AccountAddAction => {
    return {
        type: 'ACCOUNT_ADD',
        address,
        coinbase
    } as AccountAddAction;
};

export interface AccountRemoveAction extends Action {
    address: string
}

export const AccountRemove = (address: string): AccountRemoveAction => {
    return {
        type: 'ACCOUNT_REMOVE',
        address
    } as AccountRemoveAction;
};

export interface AccountUpdateAction extends Action {
    address: string,
    balance: string,
    coinbase: boolean
}

export const AccountUpdate = (address: string, balance: string, coinbase: boolean = false): AccountUpdateAction => {
    return {
        type: 'ACCOUNT_UPDATE',
        address,
        balance,
        coinbase
    } as AccountUpdateAction;
};

export interface AccountErrorAction extends Action {
    address: string,
    error: any
}

export const AccountError = (address: string, error: any): AccountErrorAction => {
    return {
        type: 'ACCOUNT_ERROR',
        address: address.toLowerCase(),
        error
    } as AccountErrorAction;
};

export interface AccountConfigAction extends Action, AccountConfigState {
}

export const AccountConfig = (config: AccountConfigState): AccountConfigAction => {
    return {
        ...config,
        type: 'ACCOUNT_CONFIG'
    } as AccountConfigAction;
};

export interface AccountUpdateRequestAction extends Action {
    address: string
}

export const AccountUpdateRequest = (address: string): AccountUpdateRequestAction => {
    return {
        type: 'ACCOUNT_UPDATE_REQUEST',
        address: address.toLowerCase()
    } as AccountUpdateRequestAction;
};

export type AccountActions = AccountAddAction | AccountRemoveAction | AccountUpdateAction | AccountErrorAction | AccountConfigAction;
