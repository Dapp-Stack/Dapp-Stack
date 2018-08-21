import {IPFSLoad, IPFSLoaded, IPFSError, IPFSConnect} from "./ipfs.actions";
import {ipfs} from "./ipfs.reducers";

declare var describe: any;
declare var test: any;
declare var expect: any;

const ipfs_hash = "QmPU2jLB1SYXMBWgWpnquQQ4JJwNoRWhDr5r3sw4HxUEDD";
const instance = {IamAN: 'instance'};
let state = {
    config: {}
};

describe("IPFS Reducers", () => {

    test("IPFSLoad", () => {
        state = ipfs(state, IPFSLoad(ipfs_hash));
        expect(state[ipfs_hash]).toBe(undefined);
    });

    test("IPFSLoaded", () => {
        state = ipfs(state, IPFSLoaded(ipfs_hash, "TEST"));
        expect(state[ipfs_hash].content).toBe("TEST");
    });

    test("IPFSError", () => {
        state = ipfs(state, IPFSError(ipfs_hash, "ERROR"));
        expect(state[ipfs_hash].error).toBe("ERROR");
    });

    test("IPFSConnect", () => {
        state = ipfs(state, IPFSConnect(instance));
        expect(state.config.active).toBe(true);
    });

});

