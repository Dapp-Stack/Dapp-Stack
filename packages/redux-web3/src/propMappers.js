"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var feed_selectors_1 = require("./feed/feed.selectors");
var vortex_1 = require("./vortex");
var event_selectors_1 = require("./event/event.selectors");
var contractLoading = {};
/**
 * Returns the requested contract instance. Will try to load it if not present in the store.
 *
 * @param {State} state The global store state.
 * @param {string} contract_name Name of the contract to load.
 * @param {string} contract_address Address of the contract to load.
 * @param {boolean} load Wether to load to contract or not if not found in store.
 * @returns {any} Returns undefined until the contract instance is found.
 */
exports.getContract = function (state, contract_name, contract_address, load) {
    if (!contract_address) {
        contract_address = state.contracts[contract_name].deployed;
    }
    if (contract_address) {
        contract_address = contract_address.toLowerCase();
        if (!state.contracts[contract_name])
            throw new Error("Unknown contract type " + contract_name);
        if (!state.contracts[contract_name][contract_address] || !state.contracts[contract_name][contract_address].instance) {
            if (!contractLoading[contract_name + contract_address] && load) {
                vortex_1.Vortex.get().loadContract(contract_name, contract_address);
                contractLoading[contract_name + contract_address] = true;
            }
            return undefined;
        }
        return state.contracts[contract_name][contract_address].instance;
    }
    else {
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
exports.callContract = function (instance, method_name) {
    var _a;
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!instance)
        return undefined;
    if (!instance.vortexMethods[method_name])
        throw new Error("Unknown method " + method_name);
    if (!instance.vortexMethods[method_name].data)
        throw new Error("Method " + method_name + " is not constant");
    return ((_a = instance.vortexMethods[method_name]).data.apply(_a, __spread(args)));
};
var feedSelectors = {};
/**
 * Returns an array of {@link FeedState}, depending on filter argument. If no filter given, all feed elements are
 * returned.
 *
 * @param {State} state The global store state.
 * @param {FeedType} filter Filter arguments.
 * @returns {FeedState[]} Returns an array of FeedElements.
 */
exports.getFeed = function (state) {
    var filter = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        filter[_i - 1] = arguments[_i];
    }
    var filter_sum = 0;
    if (!filter.length)
        filter_sum = feed_selectors_1.FeedType.Transactions | feed_selectors_1.FeedType.Contracts | feed_selectors_1.FeedType.Accounts | feed_selectors_1.FeedType.Errors | feed_selectors_1.FeedType.IPFSContent;
    else {
        for (var feed_idx = 0; feed_idx < filter.length; ++feed_idx) {
            filter_sum |= filter[feed_idx];
        }
    }
    if (!feedSelectors[filter_sum]) {
        feedSelectors[filter_sum] = feed_selectors_1.FeedFilter(filter_sum);
    }
    return feedSelectors[filter_sum](state);
};
var accountFollowing = {};
/**
 * Returns the informations about an account. Subscribe to the account if not already in store.
 *
 * @param {State} state The global store state.
 * @param {string} address Account to follow.
 * @param {boolean} follow Wether to follow if not found or not.
 * @returns {AccountInfoState | AccountErrorState} Returns undefined until information is fetched.
 */
exports.getAccount = function (state, address, follow) {
    address = address.toLowerCase();
    if (!state.accounts[address] && !accountFollowing[address] && follow) {
        vortex_1.Vortex.get().subscribeAccount(address);
        accountFollowing[address] = true;
    }
    return state.accounts[address];
};
var eventFeedSelectors = {};
var eventFeedSubscriptions = {};
/**
 * Returns an array of {@link EventFeedElementState} depending on given configuration.
 *
 * @param {State} state The global store state.
 * @param {EventFilterConfig} config Event configuration.
 * @param {boolean} subscribe If this argument is given, and all fields in config are given, will subscribe to the event.
 * @param subscribe_args Useful only if subscribe is true.
 * @returns {EventFeedElementState[]} An array of {@link EventFeedElementState}
 */
exports.getEvents = function (state, config, subscribe) {
    var _a;
    var subscribe_args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        subscribe_args[_i - 3] = arguments[_i];
    }
    var signature = "";
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
        eventFeedSelectors[signature] = event_selectors_1.EventFilter(config);
    }
    if (subscribe && config.contract_address && config.event_name && config.contract_name && !eventFeedSubscriptions[signature]) {
        (_a = vortex_1.Vortex.get()).subscribeEvent.apply(_a, __spread([config.event_name, config.contract_name, config.contract_address], subscribe_args));
        eventFeedSubscriptions[signature] = true;
    }
    return (eventFeedSelectors[signature](state));
};
var ipfsHashFetched = {};
/**
 * Returns fetched IPFS hash. Will fetch it if not already in store.
 *
 * @param {State} state The global store state.
 * @param {string} hash IPFS Hash to fetch.
 * @returns {IPFSContentState | IPFSErrorState}
 */
exports.getIPFSHash = function (state, hash) {
    if (!state.ipfs[hash] && !ipfsHashFetched[hash]) {
        vortex_1.Vortex.get().fetchIPFSHash(hash);
        ipfsHashFetched[hash] = true;
    }
    return state.ipfs[hash];
};
//# sourceMappingURL=propMappers.js.map