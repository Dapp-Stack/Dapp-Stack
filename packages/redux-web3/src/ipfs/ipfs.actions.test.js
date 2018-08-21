"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ipfs_actions_1 = require("./ipfs.actions");
var ipfs_hash = "QmPU2jLB1SYXMBWgWpnquQQ4JJwNoRWhDr5r3sw4HxUEDD";
var instance = { IamAN: 'instance' };
describe("IPFS Actions", function () {
    test("IPFSLoad", function () {
        var get = ipfs_actions_1.IPFSLoad(ipfs_hash);
        expect(get.type).toBe("IPFS_LOAD");
        expect(get.hash).toBe(ipfs_hash);
    });
    test("IPFSLoaded", function () {
        var get = ipfs_actions_1.IPFSLoaded(ipfs_hash, "TEST");
        expect(get.type).toBe("IPFS_LOADED");
        expect(get.hash).toBe(ipfs_hash);
        expect(get.content).toBe("TEST");
    });
    test("IPFSError", function () {
        var get = ipfs_actions_1.IPFSError(ipfs_hash, "ERROR");
        expect(get.type).toBe("IPFS_ERROR");
        expect(get.hash).toBe(ipfs_hash);
        expect(get.reason).toBe("ERROR");
    });
    test("IPFSConnect", function () {
        var get = ipfs_actions_1.IPFSConnect(instance);
        expect(get.type).toBe("IPFS_CONNECT");
        expect(get.instance.IamAN).toBe("instance");
    });
});
//# sourceMappingURL=ipfs.actions.test.js.map