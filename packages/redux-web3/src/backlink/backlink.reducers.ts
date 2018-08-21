import {Reducer} from 'redux';
import {
    BacklinkActions,
    BacklinkConnectedAction,
    BacklinkErrorAction,
    BacklinkDisconnectedAction,
    BacklinkDisableAction, BacklinkRemoveHookAction, BacklinkCreateHookAction
} from "./backlink.actions";
import {BacklinkHookState, BacklinkState, BacklinkSubscriptionHookState} from "../stateInterface";

const BacklinkConnectedReducer: Reducer<BacklinkState, BacklinkConnectedAction> = (state: BacklinkState, action: BacklinkConnectedAction): BacklinkState => {
    return {
        ...state,
        status: 'CONNECTED',
        url: action.url,
        instance: action.instance
    } as BacklinkState;
};

const BacklinkErrorReducer: Reducer<BacklinkState, BacklinkErrorAction> = (state: BacklinkState, action: BacklinkErrorAction): BacklinkState => {
    return {
        ...state,
        status: 'ERROR',
        error: action.error,
        instance: undefined
    } as BacklinkState;
};

const BacklinkDisconnectedReducer: Reducer<BacklinkState, BacklinkDisconnectedAction> = (state: BacklinkState, action: BacklinkErrorAction): BacklinkState => {
    return {
        ...state,
        status: 'DISCONNECTED',
        instance: undefined
    } as BacklinkState;
};

const BacklinkDisableReducer: Reducer<BacklinkState, BacklinkDisableAction> = (state: BacklinkState, action: BacklinkDisableAction): BacklinkState => {
    return {
        ...state,
        status: 'DISABLED',
        instance: undefined
    } as BacklinkState;
};

const BacklinkCreateHookReducer: Reducer<BacklinkState, BacklinkCreateHookAction> = (state: BacklinkState, action: BacklinkCreateHookAction): BacklinkState => {
    if (!state.hooks)
        state.hooks = {} as BacklinkHookState;
    if (!state.hooks[action.address.toLowerCase()])
        state.hooks[action.address.toLowerCase()] = [] as BacklinkSubscriptionHookState[];
    state.hooks[action.address.toLowerCase()].push({
        from: action.from,
        to: action.to,
        trigger: action.trigger
    });
    return {
        ...state,
        hooks: {
            ...state.hooks,
            [action.address.toLowerCase()]: [
                ...state.hooks[action.address.toLowerCase()]
            ]
        }
    } as BacklinkState;
};

const BacklinkRemoveHookReducer: Reducer<BacklinkState, BacklinkRemoveHookAction> = (state: BacklinkState, action: BacklinkRemoveHookAction): BacklinkState => {
    const {[action.address.toLowerCase()]: _, ...hooks}: BacklinkHookState = state.hooks;
    return {
        ...state,
        hooks: {
            ...hooks
        }
    }
};

export const backlink: Reducer<BacklinkState, BacklinkActions> = (state: BacklinkState = {status: 'DISABLED'} as BacklinkState, action: BacklinkActions): BacklinkState => {
    switch (action.type) {
        case 'BACKLINK_CONNECTED':
            return (BacklinkConnectedReducer(state, <BacklinkConnectedAction>action));
        case 'BACKLINK_ERROR':
            return (BacklinkErrorReducer(state, <BacklinkErrorAction>action));
        case 'BACKLINK_DISCONNECTED':
            return (BacklinkDisconnectedReducer(state, <BacklinkDisconnectedAction>action));
        case 'BACKLINK_DISABLE':
            return (BacklinkDisableReducer(state, <BacklinkDisableAction>action));
        case 'BACKLINK_CREATE_HOOK':
            return (BacklinkCreateHookReducer(state, <BacklinkCreateHookAction>action));
        case 'BACKLINK_REMOVE_HOOK':
            return (BacklinkRemoveHookReducer(state, <BacklinkRemoveHookAction>action));
        default:
            return state;
    }
};
