import {Reducer} from "redux";
import {EventActions, EventBroadcastedAction, EventInsertSubscriptionAction, EventRemoveAction} from "./event.actions";
import {EventState} from "../stateInterface";

const EventInsertSubscriptionReducer: Reducer<EventState, EventInsertSubscriptionAction> = (state: EventState, action: EventInsertSubscriptionAction): EventState => {
    return {
        ...state,
        subscriptions: {
            ...state.subscriptions,
            [action.name]: action.subscription
        }
    };
};

const EventRemoveReducer: Reducer<EventState, EventRemoveAction> = (state: EventState, action: EventRemoveAction): EventState => {
    state.subscriptions[action.event_name + ":" + action.contract_name + ":" + action.contract_address].killChannel();
    delete state.subscriptions[action.event_name + ":" + action.contract_name + ":" + action.contract_address];
    return {
        ...state,
        subscriptions: {
            ...state.subscriptions
        }
    };
};

const EventBroadcastedReducer: Reducer<EventState, EventBroadcastedAction> = (state: EventState, action: EventBroadcastedAction): EventState => {
    state.event_feed.push({
        event_name: action.event_name,
        contract_name: action.contract_name,
        contract_address: action.contract_address,
        args: action.args
    });
    return {
        ...state,
        event_feed: [
            ...state.event_feed
        ]
    };
};

export const event: Reducer<EventState, EventActions> = (state: EventState = {event_feed: [], subscriptions: {}}, action: EventActions): EventState => {
    switch (action.type) {
        case 'EVENT_INSERT_SUBSCRIPTION':
            return EventInsertSubscriptionReducer(state, <EventInsertSubscriptionAction>action);
        case 'EVENT_REMOVE':
            return EventRemoveReducer(state, <EventRemoveAction>action);
        case 'EVENT_BROADCASTED':
            return EventBroadcastedReducer(state, <EventBroadcastedAction>action);
        default:
            return state;
    }
};
