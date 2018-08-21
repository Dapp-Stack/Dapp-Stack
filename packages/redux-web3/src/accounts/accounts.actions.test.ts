import {AccountAdd, AccountConfig, AccountError, AccountRemove, AccountUpdate} from "./accounts.actions";

declare let describe: any;
declare let test: any;
declare let expect: any;

let address = "0xabcd";
let balance = "0x1234";
let coinbase = true;
let err = {msg: "NO"};

describe("Account Actions", () => {

    test("AccountAdd", () => {
        const get = AccountAdd(address, coinbase);
        expect(get.type).toBe('ACCOUNT_ADD');
        expect(get.address).toBe(address);
        expect(get.coinbase).toBe(true);
    });

    test("AccountRemove", () => {
        const get = AccountRemove(address);
        expect(get.type).toBe('ACCOUNT_REMOVE');
        expect(get.address).toBe(address);
    });

    test("AccountUpdate", () => {
        const get = AccountUpdate(address, balance);
        expect(get.type).toBe('ACCOUNT_UPDATE');
        expect(get.address).toBe(address);
        expect(get.balance).toBe(balance);
    });

    test("AccountError", () => {
        const get = AccountError(address, err);
        expect(get.type).toBe('ACCOUNT_ERROR');
        expect(get.address).toBe(address);
        expect(get.error.msg).toBe(err.msg);
    });

    test("AccountConfig", () => {
        const get = AccountConfig({refresh_rate: 200});
        expect(get.type).toBe('ACCOUNT_CONFIG');
        expect(get.refresh_rate).toBe(200);
    });

});
