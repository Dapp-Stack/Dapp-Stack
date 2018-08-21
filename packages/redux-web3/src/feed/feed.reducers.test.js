"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var feed_reducers_1 = require("./feed.reducers");
var feed_actions_1 = require("./feed.actions");
var state = undefined;
describe("Feed Reducers", function () {
    test("FeedNewTransaction", function () {
        state = feed_reducers_1.feed(state, feed_actions_1.FeedNewTransaction("0xabcd"));
        expect(state[0].transaction_hash).toBe("0xabcd");
        expect(state[0].action).toBe("NEW_TRANSACTION");
    });
    test("FeedNewContract", function () {
        state = feed_reducers_1.feed(state, feed_actions_1.FeedNewContract("Ballot", "0x1234"));
        expect(state[1].contract_name).toBe("Ballot");
        expect(state[1].contract_address).toBe("0x1234");
        expect(state[1].action).toBe("NEW_CONTRACT");
    });
    test("FeedNewError", function () {
        state = feed_reducers_1.feed(state, feed_actions_1.FeedNewError(new Error("Ho"), "Testing Error", "[feed.reducers.test.ts] Trying to manualy trigger error."));
        expect(state[2].error.message).toBe("Testing Error");
        expect(state[2].error.when).toBe("[feed.reducers.test.ts] Trying to manualy trigger error.");
        expect(state[2].error.reason.message).toBe("Ho");
        expect(state[2].action).toBe("NEW_ERROR");
    });
});
//# sourceMappingURL=feed.reducers.test.js.map