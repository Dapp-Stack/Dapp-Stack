import {IPFSLoad, IPFSError, IPFSLoaded, IPFSConnect} from "./ipfs.actions";

declare let describe: any;
declare let test: any;
declare let expect: any;

const ipfs_hash = "QmPU2jLB1SYXMBWgWpnquQQ4JJwNoRWhDr5r3sw4HxUEDD";
const instance = {IamAN: 'instance'};

describe("IPFS Actions", () => {

    test("IPFSLoad", () => {
        const get = IPFSLoad(ipfs_hash);
        expect(get.type).toBe("IPFS_LOAD");
        expect(get.hash).toBe(ipfs_hash);
    });

    test("IPFSLoaded", () => {
        const get = IPFSLoaded(ipfs_hash, "TEST");
        expect(get.type).toBe("IPFS_LOADED");
        expect(get.hash).toBe(ipfs_hash);
        expect(get.content).toBe("TEST");
    });

    test("IPFSError", () => {
        const get = IPFSError(ipfs_hash, "ERROR");
        expect(get.type).toBe("IPFS_ERROR");
        expect(get.hash).toBe(ipfs_hash);
        expect(get.reason).toBe("ERROR");
    });

    test("IPFSConnect", () => {
        const get = IPFSConnect(instance);
        expect(get.type).toBe("IPFS_CONNECT");
        expect(get.instance.IamAN).toBe("instance");
    })

});
