import { AccountErrorState, AccountInfoState, EventFeedElementState, IPFSContentState, IPFSErrorState, State } from "./stateInterface";
import { FeedType } from "./feed/feed.selectors";
import { EventFilterConfig } from "./event/event.selectors";
/**
 * Returns the requested contract instance. Will try to load it if not present in the store.
 *
 * @param {State} state The global store state.
 * @param {string} contract_name Name of the contract to load.
 * @param {string} contract_address Address of the contract to load.
 * @param {boolean} load Wether to load to contract or not if not found in store.
 * @returns {any} Returns undefined until the contract instance is found.
 */
export declare const getContract: (state: State, contract_name: string, contract_address?: string | undefined, load?: boolean | undefined) => any;
/**
 * Return the value of the constant call. Chain it with getContract for safety.
 *
 * @param instance Instance of contract, recoverable with {@link getContract}.
 * @param {string} method_name Name of constant method.
 * @param args Arguments for the constant call (including transaction arguments).
 * @returns {any} Returns undefined until everything is loaded.
 */
export declare const callContract: (instance: any, method_name: string, ...args: any[]) => any;
/**
 * Returns an array of {@link FeedState}, depending on filter argument. If no filter given, all feed elements are
 * returned.
 *
 * @param {State} state The global store state.
 * @param {FeedType} filter Filter arguments.
 * @returns {FeedState[]} Returns an array of FeedElements.
 */
export declare const getFeed: (state: State, ...filter: FeedType[]) => (import("./stateInterface").FeedNewContractState | import("./stateInterface").FeedNewTransactionState | import("./stateInterface").FeedNewIPFSContentState | import("./stateInterface").FeedNewErrorState | import("./stateInterface").FeedNewAccountState)[];
/**
 * Returns the informations about an account. Subscribe to the account if not already in store.
 *
 * @param {State} state The global store state.
 * @param {string} address Account to follow.
 * @param {boolean} follow Wether to follow if not found or not.
 * @returns {AccountInfoState | AccountErrorState} Returns undefined until information is fetched.
 */
export declare const getAccount: (state: State, address: string, follow?: boolean | undefined) => AccountInfoState | AccountErrorState;
/**
 * Returns an array of {@link EventFeedElementState} depending on given configuration.
 *
 * @param {State} state The global store state.
 * @param {EventFilterConfig} config Event configuration.
 * @param {boolean} subscribe If this argument is given, and all fields in config are given, will subscribe to the event.
 * @param subscribe_args Useful only if subscribe is true.
 * @returns {EventFeedElementState[]} An array of {@link EventFeedElementState}
 */
export declare const getEvents: (state: State, config?: EventFilterConfig | undefined, subscribe?: boolean | undefined, ...subscribe_args: any[]) => EventFeedElementState[];
/**
 * Returns fetched IPFS hash. Will fetch it if not already in store.
 *
 * @param {State} state The global store state.
 * @param {string} hash IPFS Hash to fetch.
 * @returns {IPFSContentState | IPFSErrorState}
 */
export declare const getIPFSHash: (state: State, hash: string) => IPFSContentState | IPFSErrorState;
