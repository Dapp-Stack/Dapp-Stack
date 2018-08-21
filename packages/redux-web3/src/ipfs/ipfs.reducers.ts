import {Reducer} from 'redux';
import {IPFSConfigState, IPFSContentState, IPFSErrorState, IPFSStoreState} from "../stateInterface";
import {IPFSErrorAction, IPFSLoadedAction, IPFSActions, IPFSConnectAction} from "./ipfs.actions";

const IPFSLoadedReducer: Reducer<IPFSStoreState, IPFSLoadedAction> = (state: IPFSStoreState, action: IPFSLoadedAction): IPFSStoreState => {
    return {
        ...state,
        [action.hash]: {
            content: action.content
        } as IPFSContentState
    };
};

const IPFSErrorReducer: Reducer<IPFSStoreState, IPFSErrorAction> = (state: IPFSStoreState, action: IPFSErrorAction): IPFSStoreState => {
    return {
        ...state,
        [action.hash]: {
            error: action.reason
        } as IPFSErrorState
    };
};

const IPFSConnectReducer: Reducer<IPFSStoreState, IPFSConnectAction> = (state: IPFSStoreState, action: IPFSConnectAction): IPFSStoreState => {
    return {
        ...state,
        config: {
            ...state.config,
            instance: action.instance,
            active: true
        } as IPFSConfigState
    }
};

export const ipfs: Reducer<IPFSStoreState, IPFSActions> = (state: IPFSStoreState = {}, action: IPFSActions): IPFSStoreState => {
    switch (action.type) {
        case 'IPFS_LOADED':
            return IPFSLoadedReducer(state, <IPFSLoadedAction>action);
        case 'IPFS_ERROR':
            return IPFSErrorReducer(state, <IPFSErrorAction>action);
        case 'IPFS_CONNECT':
            return IPFSConnectReducer(state, <IPFSConnectAction>action);
        default:
            return state;
    }
};
