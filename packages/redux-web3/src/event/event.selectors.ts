import {createSelector, OutputSelector} from "reselect";
import {EventFeedElementState, FeedState, State} from "../stateInterface";

const getEventFeed = (state: State): EventFeedElementState[] => state.event.event_feed;

export interface EventFilterConfig {
    event_name?: string,
    contract_name?: string,
    contract_address?: string
}

export const EventFilter = (options?: EventFilterConfig): OutputSelector<State, EventFeedElementState[], (res: EventFeedElementState[]) => EventFeedElementState[]> => {
    return createSelector(getEventFeed, (feed: EventFeedElementState[]): EventFeedElementState[] => {
        return feed.filter((elem: EventFeedElementState) => {
            if (options) {
                if (options.event_name && elem.event_name !== options.event_name)
                    return false;
                if (options.contract_address && elem.contract_address.toLowerCase() !== options.contract_address.toLowerCase())
                    return false;
                if (options.contract_name && elem.contract_name !== options.contract_name)
                    return false;

                return true;
            } else {
                return true;
            }
        });
    });
};
