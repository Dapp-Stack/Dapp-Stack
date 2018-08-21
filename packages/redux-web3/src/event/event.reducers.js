"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var EventInsertSubscriptionReducer = function (state, action) {
    var _a;
    return __assign({}, state, { subscriptions: __assign({}, state.subscriptions, (_a = {}, _a[action.name] = action.subscription, _a)) });
};
var EventRemoveReducer = function (state, action) {
    state.subscriptions[action.event_name + ":" + action.contract_name + ":" + action.contract_address].killChannel();
    delete state.subscriptions[action.event_name + ":" + action.contract_name + ":" + action.contract_address];
    return __assign({}, state, { subscriptions: __assign({}, state.subscriptions) });
};
var EventBroadcastedReducer = function (state, action) {
    state.event_feed.push({
        event_name: action.event_name,
        contract_name: action.contract_name,
        contract_address: action.contract_address,
        args: action.args
    });
    return __assign({}, state, { event_feed: __spread(state.event_feed) });
};
exports.event = function (state, action) {
    if (state === void 0) { state = { event_feed: [], subscriptions: {} }; }
    switch (action.type) {
        case 'EVENT_INSERT_SUBSCRIPTION':
            return EventInsertSubscriptionReducer(state, action);
        case 'EVENT_REMOVE':
            return EventRemoveReducer(state, action);
        case 'EVENT_BROADCASTED':
            return EventBroadcastedReducer(state, action);
        default:
            return state;
    }
};
//# sourceMappingURL=event.reducers.js.map