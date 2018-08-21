"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAdd = function (contract_name, contract_address, event_name, args) {
    return {
        type: 'EVENT_ADD',
        contract_name: contract_name,
        contract_address: contract_address,
        event_name: event_name,
        args: args
    };
};
exports.EventInsertSubscription = function (name, subscription) {
    return {
        type: 'EVENT_INSERT_SUBSCRIPTION',
        name: name,
        subscription: subscription
    };
};
exports.EventRemove = function (contract_name, contract_address, event_name) {
    return {
        type: 'EVENT_REMOVE',
        contract_name: contract_name,
        contract_address: contract_address,
        event_name: event_name
    };
};
exports.EventBroadcasted = function (event_name, contract_name, contract_address, args) {
    return {
        type: 'EVENT_BROADCASTED',
        event_name: event_name,
        contract_name: contract_name,
        contract_address: contract_address,
        args: args
    };
};
//# sourceMappingURL=event.actions.js.map