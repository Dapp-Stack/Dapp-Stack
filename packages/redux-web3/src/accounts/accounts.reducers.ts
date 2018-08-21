import {Reducer} from "redux";
import {AccountConfigState, AccountInfoState, AccountStoreState} from "../stateInterface";
import {
    AccountActions,
    AccountConfigAction, AccountErrorAction,
    AccountRemoveAction,
    AccountUpdateAction
} from "./accounts.actions";

const AccountRemoveReducer: Reducer<AccountStoreState, AccountRemoveAction> = (state: AccountStoreState, action: AccountRemoveAction): AccountStoreState => {
    delete state[action.address];
    return {
        ...state,
    };
};

const AccountUpdateReducer: Reducer<AccountStoreState, AccountUpdateAction> = (state: AccountStoreState, action: AccountUpdateAction): AccountStoreState => {
    if ((state[action.address] && (<AccountInfoState>state[action.address]).coinbase) || action.coinbase)
        return {
            ...state,
            [action.address]: {
                ...state[action.address],
                balance: action.balance,
                coinbase: true
            },
            coinbase: {
                ...state.coinbase,
                balance: action.balance,
                coinbase: true
            }
        };
    return {
        ...state,
        [action.address]: {
            ...state[action.address],
            balance: action.balance,
            coinbase: action.coinbase
        }
    };
};

const AccountConfigReducer: Reducer<AccountStoreState, AccountConfigAction> = (state: AccountStoreState, action: AccountConfigAction): AccountStoreState => {
    const inserter: AccountConfigState = {
        refresh_rate: action.refresh_rate
    };
    return {
        ...state,
        configuration: {
            ...state.configuration,
            ...inserter
        }
    };
};

const AccountErrorReducer: Reducer<AccountStoreState, AccountErrorAction> = (state: AccountStoreState, action: AccountErrorAction): AccountStoreState => {
    if (state[action.address] && (<AccountInfoState>state[action.address]).coinbase)
        return {
            ...state,
            [action.address]: {
                ...state[action.address],
                error: action.error
            },
            coinbase: {
                ...state.coinbase,
                error: action.error
            }
        };
    return {
        ...state,
        [action.address]: {
            ...state[action.address],
            error: action.error
        }
    };
};

export const accounts: Reducer<AccountStoreState, AccountActions> = (state: AccountStoreState = {} as AccountStoreState, action: AccountActions): AccountStoreState => {
    switch (action.type) {
        case 'ACCOUNT_REMOVE':
            return AccountRemoveReducer(state, <AccountRemoveAction>action);
        case 'ACCOUNT_UPDATE':
            return AccountUpdateReducer(state, <AccountUpdateAction>action);
        case 'ACCOUNT_CONFIG':
            return AccountConfigReducer(state, <AccountConfigAction>action);
        case 'ACCOUNT_ERROR':
            return AccountErrorReducer(state, <AccountErrorAction>action);
        default:
            return state;
    }
};
