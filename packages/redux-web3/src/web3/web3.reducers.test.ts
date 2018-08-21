declare var describe: any;
declare var test: any;
declare var expect: any;

import {Web3Load, Web3Loaded, Web3LoadError, Web3Locked, Web3NetworkError} from "./web3.actions";
import {web3} from './web3.reducers';

let state = undefined;

describe("Web3 Reducers", () => {

    test("Web3Load", () => {
        state = web3(state, Web3Load(new Promise<any>((ok: any, ko: any): void => {}), []));
        expect(state.status).toBe('LOADING');
    });

    test("Web3Loaded", () => {
        state = web3(state, Web3Loaded({test: 1234}, 4321, "0xabcd"));
        expect(state._.test).toBe(1234);
        expect(state.network_id).toBe(4321);
        expect(state.status).toBe('LOADED');
        expect(state.coinbase).toBe("0xabcd");
    });

    test("Web3LoadError", () => {
        state = web3(state, Web3LoadError(new Error("TEST")));
        expect(state.error.message).toBe("TEST");
        expect(state.status).toBe("LOAD_ERROR");
    });

    test("Web3NetworkError", () => {
        state = web3(state, Web3NetworkError(345));
        expect(state.network_id).toBe(345);
        expect(state.status).toBe("NETWORK_ERROR");
    });

    test("Web3Locked", () => {
        state = web3(state, Web3Locked());
        expect(state.status).toBe("LOCKED");
    });

});
