import {Action} from "redux";

export interface EventAddAction extends Action {
    contract_name: string,
    contract_address: string,
    event_name: string,
    args: string[]
}

export const EventAdd = (contract_name: string, contract_address: string, event_name: string, args: string[]): EventAddAction => {
    return {
        type: 'EVENT_ADD',
        contract_name,
        contract_address,
        event_name,
        args
    } as EventAddAction;
};

export interface EventInsertSubscriptionAction extends Action {
    name: string,
    subscription: any
}

export const EventInsertSubscription = (name: string, subscription: any): EventInsertSubscriptionAction => {
    return {
        type: 'EVENT_INSERT_SUBSCRIPTION',
        name,
        subscription
    } as EventInsertSubscriptionAction;
};

export interface EventRemoveAction extends Action {
    contract_name: string,
    contract_address: string,
    event_name: string
}

export const EventRemove = (contract_name: string, contract_address: string, event_name: string): EventRemoveAction => {
    return {
        type: 'EVENT_REMOVE',
        contract_name,
        contract_address,
        event_name
    } as EventRemoveAction;
};

export interface EventBroadcastedAction extends Action {
    event_name: string,
    contract_name: string,
    contract_address: string,
    args: any
}

export const EventBroadcasted = (event_name: string, contract_name: string, contract_address: string, args: any): EventBroadcastedAction => {
    return {
        type: 'EVENT_BROADCASTED',
        event_name,
        contract_name,
        contract_address,
        args
    } as EventBroadcastedAction;
};

export type EventActions = EventAddAction | EventInsertSubscriptionAction | EventRemoveAction;
