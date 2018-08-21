"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var accounts_actions_1 = require("./accounts.actions");
var address = "0xabcd";
var balance = "0x1234";
var coinbase = true;
var err = { msg: "NO" };
describe("Account Actions", function () {
    test("AccountAdd", function () {
        var get = accounts_actions_1.AccountAdd(address, coinbase);
        expect(get.type).toBe('ACCOUNT_ADD');
        expect(get.address).toBe(address);
        expect(get.coinbase).toBe(true);
    });
    test("AccountRemove", function () {
        var get = accounts_actions_1.AccountRemove(address);
        expect(get.type).toBe('ACCOUNT_REMOVE');
        expect(get.address).toBe(address);
    });
    test("AccountUpdate", function () {
        var get = accounts_actions_1.AccountUpdate(address, balance);
        expect(get.type).toBe('ACCOUNT_UPDATE');
        expect(get.address).toBe(address);
        expect(get.balance).toBe(balance);
    });
    test("AccountError", function () {
        var get = accounts_actions_1.AccountError(address, err);
        expect(get.type).toBe('ACCOUNT_ERROR');
        expect(get.address).toBe(address);
        expect(get.error.msg).toBe(err.msg);
    });
    test("AccountConfig", function () {
        var get = accounts_actions_1.AccountConfig({ refresh_rate: 200 });
        expect(get.type).toBe('ACCOUNT_CONFIG');
        expect(get.refresh_rate).toBe(200);
    });
});
//# sourceMappingURL=accounts.actions.test.js.map