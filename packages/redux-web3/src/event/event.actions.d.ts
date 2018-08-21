import { Action } from "redux";
export interface EventAddAction extends Action {
    contract_name: string;
    contract_address: string;
    event_name: string;
    args: string[];
}
export declare const EventAdd: (contract_name: string, contract_address: string, event_name: string, args: string[]) => EventAddAction;
export interface EventInsertSubscriptionAction extends Action {
    name: string;
    subscription: any;
}
export declare const EventInsertSubscription: (name: string, subscription: any) => EventInsertSubscriptionAction;
export interface EventRemoveAction extends Action {
    contract_name: string;
    contract_address: string;
    event_name: string;
}
export declare const EventRemove: (contract_name: string, contract_address: string, event_name: string) => EventRemoveAction;
export interface EventBroadcastedAction extends Action {
    event_name: string;
    contract_name: string;
    contract_address: string;
    args: any;
}
export declare const EventBroadcasted: (event_name: string, contract_name: string, contract_address: string, args: any) => EventBroadcastedAction;
export declare type EventActions = EventAddAction | EventInsertSubscriptionAction | EventRemoveAction;
