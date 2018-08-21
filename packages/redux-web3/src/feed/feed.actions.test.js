"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var feed_actions_1 = require("./feed.actions");
describe("Feed Actions", function () {
    test("FeedNewTransaction", function () {
        var ret = feed_actions_1.FeedNewTransaction("0x54321");
        expect(ret.txHash).toBe("0x54321");
        expect(ret.type).toBe('FEED_NEW_TRANSACTION');
    });
    test("FeedNewContract", function () {
        var ret = feed_actions_1.FeedNewContract("Ballot", "0x1234");
        expect(ret.contractName).toBe("Ballot");
        expect(ret.address).toBe("0x1234");
        expect(ret.type).toBe('FEED_NEW_CONTRACT');
    });
    test("FeedNewError", function () {
        var ret = feed_actions_1.FeedNewError({ test: 'TEST' }, "You made a mistake", "Doing some tests");
        expect(ret.reason.test).toBe('TEST');
        expect(ret.when).toBe('Doing some tests');
        expect(ret.message).toBe("You made a mistake");
        expect(ret.type).toBe('FEED_NEW_ERROR');
    });
    test("FeedNewAccount", function () {
        var ret = feed_actions_1.FeedNewAccount("0xabc", true);
        expect(ret.type).toBe('FEED_NEW_ACCOUNT');
        expect(ret.account).toBe('0xabc');
        expect(ret.coinbase).toBe(true);
    });
    test("FeedNewAccount", function () {
        var ret = feed_actions_1.FeedNewIPFSContent("SALUT");
        expect(ret.type).toBe('FEED_NEW_IPFS_CONTENT');
        expect(ret.ipfs_hash).toBe('SALUT');
    });
});
//# sourceMappingURL=feed.actions.test.js.map