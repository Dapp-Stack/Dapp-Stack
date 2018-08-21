import { OutputSelector } from "reselect";
import { EventFeedElementState, State } from "../stateInterface";
export interface EventFilterConfig {
    event_name?: string;
    contract_name?: string;
    contract_address?: string;
}
export declare const EventFilter: (options?: EventFilterConfig | undefined) => OutputSelector<State, EventFeedElementState[], (res: EventFeedElementState[]) => EventFeedElementState[]>;
