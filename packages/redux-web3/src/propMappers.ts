import {
    AccountErrorState,
    AccountInfoState,
    EventFeedElementState,
    FeedState,
    IPFSContentState,
    IPFSErrorState,
    State
} from "./stateInterface";
import {FeedType, FeedFilter} from "./feed/feed.selectors";
import {Vortex} from './vortex';
import {EventFilter, EventFilterConfig} from "./event/event.selectors";

const contractLoading = {};

/**
 * Returns the requested contract instance. Will try to load it if not present in the store.
 *
 * @param {State} state The global store state.
 * @param {string} contract_name Name of the contract to load.
 * @param {string} contract_address Address of the contract to load.
 * @param {boolean} load Wether to load to contract or not if not found in store.
 * @returns {any} Returns undefined until the contract instance is found.
 */
export const getContract = (state: State, contract_name: string, contract_address?: string, load?: boolean): any => {
    if (!contract_address) {
        contract_address = (<Object>state.contracts)[contract_name].deployed;
    }
    if (contract_address) {
        contract_address = contract_address.toLowerCase();
        if (!state.contracts[contract_name])
            throw new Error("Unknown contract type " + contract_name);
        if (!state.contracts[contract_name][contract_address] || !state.contracts[contract_name][contract_address].instance) {
            if (!contractLoading[contract_name + contract_address] && load) {
                Vortex.get().loadContract(contract_name, contract_address);
                contractLoading[contract_name + contract_address] = true;
            }
            return undefined;
        }
        return state.contracts[contract_name][contract_address].instance;
    } else {
        return undefined;
    }
};

/**
 * Return the value of the constant call. Chain it with getContract for safety.
 *
 * @param instance Instance of contract, recoverable with {@link getContract}.
 * @param {string} method_name Name of constant method.
 * @param args Arguments for the constant call (including transaction arguments).
 * @returns {any} Returns undefined until everything is loaded.
 */
export const callContract = (instance: any, method_name: string, ...args: any[]): any => {
    if (!instance)
        return undefined;
    if (!instance.vortexMethods[method_name])
        throw new Error("Unknown method " + method_name);
    if (!instance.vortexMethods[method_name].data)
        throw new Error("Method " + method_name + " is not constant");
    return (instance.vortexMethods[method_name].data(...args));
};

const feedSelectors = {};

/**
 * Returns an array of {@link FeedState}, depending on filter argument. If no filter given, all feed elements are
 * returned.
 *
 * @param {State} state The global store state.
 * @param {FeedType} filter Filter arguments.
 * @returns {FeedState[]} Returns an array of FeedElements.
 */
export const getFeed = (state: State, ...filter: FeedType[]): FeedState[] => {
    let filter_sum = 0;
    if (!filter.length)
        filter_sum = FeedType.Transactions | FeedType.Contracts | FeedType.Accounts | FeedType.Errors | FeedType.IPFSContent;
    else {
        for (let feed_idx = 0; feed_idx < filter.length; ++feed_idx) {
            filter_sum |= filter[feed_idx];
        }
    }
    if (!feedSelectors[filter_sum]) {
        feedSelectors[filter_sum] = FeedFilter(filter_sum);
    }
    return feedSelectors[filter_sum](state);
};

const accountFollowing = {};

/**
 * Returns the informations about an account. Subscribe to the account if not already in store.
 *
 * @param {State} state The global store state.
 * @param {string} address Account to follow.
 * @param {boolean} follow Wether to follow if not found or not.
 * @returns {AccountInfoState | AccountErrorState} Returns undefined until information is fetched.
 */
export const getAccount = (state: State, address: string, follow?: boolean): AccountInfoState | AccountErrorState => {
    address = address.toLowerCase();
    if (!state.accounts[address] && !accountFollowing[address] && follow) {
        Vortex.get().subscribeAccount(address);
        accountFollowing[address] = true;
    }
    return <AccountInfoState | AccountErrorState>state.accounts[address];
};

const eventFeedSelectors = {};
const eventFeedSubscriptions = {};

/**
 * Returns an array of {@link EventFeedElementState} depending on given configuration.
 *
 * @param {State} state The global store state.
 * @param {EventFilterConfig} config Event configuration.
 * @param {boolean} subscribe If this argument is given, and all fields in config are given, will subscribe to the event.
 * @param subscribe_args Useful only if subscribe is true.
 * @returns {EventFeedElementState[]} An array of {@link EventFeedElementState}
 */
export const getEvents = (state: State, config?: EventFilterConfig, subscribe?: boolean, ...subscribe_args: any[]): EventFeedElementState[] => {
    let signature = "";
    if (!config)
        signature = "none:none:none";
    else {
        signature += (config.event_name || "none") + ":";
        signature += (config.contract_name || "none") + ":";
        if (config.contract_address)
            config.contract_address = config.contract_address.toLowerCase();
        signature += (config.contract_address || "none");
    }
    if (!eventFeedSelectors[signature]) {
        eventFeedSelectors[signature] = EventFilter(config);
    }
    if (subscribe && config.contract_address && config.event_name && config.contract_name && !eventFeedSubscriptions[signature]) {
        Vortex.get().subscribeEvent(config.event_name, config.contract_name, config.contract_address, ...subscribe_args);
        eventFeedSubscriptions[signature] = true;
    }
    return (eventFeedSelectors[signature](state));
};

const ipfsHashFetched = {};

/**
 * Returns fetched IPFS hash. Will fetch it if not already in store.
 *
 * @param {State} state The global store state.
 * @param {string} hash IPFS Hash to fetch.
 * @returns {IPFSContentState | IPFSErrorState}
 */
export const getIPFSHash = (state: State, hash: string): IPFSContentState | IPFSErrorState => {
    if (!state.ipfs[hash] && !ipfsHashFetched[hash]) {
        Vortex.get().fetchIPFSHash(hash);
        ipfsHashFetched[hash] = true;
    }
    return (<IPFSContentState | IPFSErrorState>state.ipfs[hash]);
};
