"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reselect_1 = require("reselect");
var getEventFeed = function (state) { return state.event.event_feed; };
exports.EventFilter = function (options) {
    return reselect_1.createSelector(getEventFeed, function (feed) {
        return feed.filter(function (elem) {
            if (options) {
                if (options.event_name && elem.event_name !== options.event_name)
                    return false;
                if (options.contract_address && elem.contract_address.toLowerCase() !== options.contract_address.toLowerCase())
                    return false;
                if (options.contract_name && elem.contract_name !== options.contract_name)
                    return false;
                return true;
            }
            else {
                return true;
            }
        });
    });
};
//# sourceMappingURL=event.selectors.js.map