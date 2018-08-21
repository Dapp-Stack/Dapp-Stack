import {Web3Load, Web3Loaded, Web3LoadError, Web3Locked, Web3NetworkError} from "./web3.actions";

declare var describe: any;
declare var test: any;
declare var expect: any;

describe("Web3 Actions", () => {

    test("Web3Load", () => {
        expect(Web3Load((new Promise<any>((ok: any, ko: any): void => {})), []).type).toBe('LOAD_WEB3');
    });

    test("Web3Loaded", () => {
        const ret = Web3Loaded({test: 123}, 34, "0xabcd");
        expect(ret.networkId).toBe(34);
        expect(ret._.test).toBe(123);
        expect(ret.type).toBe('LOADED_WEB3');
        expect(ret.coinbase).toBe("0xabcd");
    });

    test("Web3LoadError", () => {
        const ret = Web3LoadError(new Error("TEST"));
        expect(ret.error.message).toBe("TEST");
        expect(ret.type).toBe('LOAD_ERROR_WEB3');
    });

    test("Web3NetworkError", () => {
        const ret = Web3NetworkError(1234);
        expect(ret.networkId).toBe(1234);
        expect(ret.type).toBe('NETWORK_ERROR_WEB3');
    });

    test("Web3Locked", () => {
        const ret = Web3Locked();
        expect(ret.type).toBe('LOCKED_WEB3');
    });

});
