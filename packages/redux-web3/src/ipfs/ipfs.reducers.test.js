"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ipfs_actions_1 = require("./ipfs.actions");
var ipfs_reducers_1 = require("./ipfs.reducers");
var ipfs_hash = "QmPU2jLB1SYXMBWgWpnquQQ4JJwNoRWhDr5r3sw4HxUEDD";
var instance = { IamAN: 'instance' };
var state = {
    config: {}
};
describe("IPFS Reducers", function () {
    test("IPFSLoad", function () {
        state = ipfs_reducers_1.ipfs(state, ipfs_actions_1.IPFSLoad(ipfs_hash));
        expect(state[ipfs_hash]).toBe(undefined);
    });
    test("IPFSLoaded", function () {
        state = ipfs_reducers_1.ipfs(state, ipfs_actions_1.IPFSLoaded(ipfs_hash, "TEST"));
        expect(state[ipfs_hash].content).toBe("TEST");
    });
    test("IPFSError", function () {
        state = ipfs_reducers_1.ipfs(state, ipfs_actions_1.IPFSError(ipfs_hash, "ERROR"));
        expect(state[ipfs_hash].error).toBe("ERROR");
    });
    test("IPFSConnect", function () {
        state = ipfs_reducers_1.ipfs(state, ipfs_actions_1.IPFSConnect(instance));
        expect(state.config.active).toBe(true);
    });
});
//# sourceMappingURL=ipfs.reducers.test.js.map