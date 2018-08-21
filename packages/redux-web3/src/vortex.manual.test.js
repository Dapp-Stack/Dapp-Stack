"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vortex_1 = require("./vortex");
var Migrations = require("../../setup/truffle/build/contracts/Migrations.json");
var feed_actions_1 = require("./feed/feed.actions");
var Web3 = require("web3");
var IPFSApi = require("ipfs-api");
var ipfs_actions_1 = require("./ipfs/ipfs.actions");
var effects_1 = require("redux-saga/effects");
var event_actions_1 = require("./event/event.actions");
var IPFS = IPFSApi('ipfs.infura.io', '5001', { protocol: 'https' });
var IPFS_hash;
var IPFS_fake_hash = "QmaoJEsqFkHETuCzGukYtfdJFCgNa2JKVNmdMbNdtRwszB";
var to_ipfs = new Buffer("ABCDEF");
var _web3;
var getWeb3 = new Promise(function (ok, ko) {
    try {
        _web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));
        ok(_web3);
    }
    catch (e) {
        ko(e);
    }
});
var sagaDone = {
    done: null
};
function onLoaded(action) {
    return __generator(this, function (_a) {
        sagaDone.done();
        return [2 /*return*/];
    });
}
function testSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, effects_1.takeEvery('LOAD_WEB3', onLoaded)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
describe("Vortex", function () {
    test('Instantiate', function () {
        var vtx = vortex_1.Vortex.factory({
            type: "manual",
            manual_contracts: {
                Migrations: {
                    abi: Migrations.abi,
                    deployed_bytecode: Migrations.deployedBytecode,
                    at: Migrations.networks[Object.keys(Migrations.networks)[0]].address
                }
            }
        }, getWeb3, {
            custom_sagas: [
                testSaga
            ],
            ipfs_config: {
                host: 'ipfs.infura.io',
                port: '5001',
                options: {
                    protocol: 'https'
                }
            },
            backlink_config: {
                url: {
                    "mainnet": "wss://mainnet.infura.io/ws",
                    "default": "ws://localhost:8546/ws"
                }
            }
        });
        expect(vtx.Contracts.manual_contracts['Migrations']).not.toBe(undefined);
    });
    test("IPFS Push", function (done) {
        IPFS.files.add(to_ipfs).then(function (res) {
            IPFS_hash = res[0].hash;
            done();
        });
    }, 60000);
    test('Recover Instance', function () {
        expect(vortex_1.Vortex.get().Contracts.manual_contracts['Migrations']).not.toBe(undefined);
    });
    test('Run Instance', function () {
        vortex_1.Vortex.get().run();
    });
    test('Load Web3', function (done) {
        sagaDone.done = done;
        vortex_1.Vortex.get().loadWeb3();
    });
    test('Add Event', function (done) {
        setTimeout(function () {
            vortex_1.Vortex.get().Store.dispatch(event_actions_1.EventAdd("Migrations", Migrations.networks[Object.keys(Migrations.networks)[0]].address, "Test"));
            done();
        }, 10000);
    }, 30000);
    test('Check Coinbase Balance', function (done) {
        setTimeout(function () {
            done(expect(vortex_1.Vortex.get().Store.getState().accounts.coinbase).not.toBe(undefined));
        }, 1000);
    });
    test('Get accounts and follow them', function (done) {
        _web3.eth.getAccounts().then(function (acc) {
            vortex_1.Vortex.get().subscribeAccount(acc[1]);
            setTimeout(function () {
                done(expect(vortex_1.Vortex.get().Store.getState().accounts[acc[1].toLowerCase()]).not.toBe(undefined));
            }, 1000);
        });
    });
    test('Send New Transaction from dispatch', function (done) {
        _web3.eth.getAccounts().then(function (acc) {
            vortex_1.Vortex.get().Store.dispatch({
                type: 'TX_SEND',
                txArgs: {
                    from: acc[0],
                    to: acc[1],
                    value: 1234
                },
                web3: _web3
            });
        });
        var intervalId = setInterval(function () {
            var state = vortex_1.Vortex.get().Store.getState();
            switch (state.feed.length) {
                case 4:
                    var txHash = state.feed[3].transaction_hash;
                    if (state.tx[txHash].status.type === 'RECEIPT') {
                        clearInterval(intervalId);
                        done();
                    }
                    if (state.tx[txHash].status.type === 'ERROR') {
                        clearInterval(intervalId);
                        done(new Error(JSON.stringify(state.tx[txHash])));
                    }
                    break;
                default:
                    break;
            }
        }, 1000);
    }, 10000);
    test('Send New Transaction from web3', function (done) {
        _web3.eth.getAccounts().then(function (acc) {
            _web3.eth.vortexSendTransaction({
                from: acc[0],
                to: acc[1],
                value: 1234
            });
        });
        var intervalId = setInterval(function () {
            var state = vortex_1.Vortex.get().Store.getState();
            switch (state.feed.length) {
                case 5:
                    var txHash = state.feed[4].transaction_hash;
                    if (state.tx[txHash].status.type === 'RECEIPT') {
                        clearInterval(intervalId);
                        done();
                    }
                    if (state.tx[txHash].status.type === 'ERROR') {
                        clearInterval(intervalId);
                        done(new Error(JSON.stringify(state.tx[txHash])));
                    }
                    break;
                default:
                    break;
            }
        }, 1000);
    }, 10000);
    test('Adding New Transaction to Feed', function () {
        vortex_1.Vortex.get().Store.dispatch(feed_actions_1.FeedNewTransaction("Dummy Tx"));
        expect(vortex_1.Vortex.get().Store.getState().feed[5].action).toBe('NEW_TRANSACTION');
    });
    test('Adding New Contract to Feed', function () {
        vortex_1.Vortex.get().Store.dispatch(feed_actions_1.FeedNewContract("Dummy Tx", "0xabcd"));
        expect(vortex_1.Vortex.get().Store.getState().feed[6].action).toBe('NEW_CONTRACT');
    });
    test('Recover Owner from constant call', function (done) {
        var state = vortex_1.Vortex.get().Store.getState();
        var contractName = state.feed[0].contract_name;
        var contractAddress = state.feed[0].contract_address.toLowerCase();
        var contract = state.contracts[contractName][contractAddress].instance;
        contract.vortexMethods.owner.call().then(function (res) {
            if (contract.vortexMethods.owner.data() === res) {
                done();
            }
        }).catch(function (e) {
            done(e);
        });
    });
    test('Call State modifying method, expect txHash and new tx', function (done) {
        var state = vortex_1.Vortex.get().Store.getState();
        var coinbase = state.web3.coinbase;
        var contractName = state.feed[0].contract_name;
        var contractAddress = state.feed[0].contract_address;
        var contract = state.contracts[contractName][contractAddress].instance;
        contract.vortexMethods.setCompleted.send(23, { from: coinbase }).then(function (_txHash) {
            var intervalId = setInterval(function () {
                var state = vortex_1.Vortex.get().Store.getState();
                switch (state.feed.length) {
                    case 8:
                        var txHash = state.feed[7].transaction_hash;
                        if (state.tx[txHash].status.type === 'RECEIPT') {
                            clearInterval(intervalId);
                            done();
                        }
                        if (state.tx[txHash].status.type === 'ERROR') {
                            clearInterval(intervalId);
                            done(new Error(JSON.stringify(state.tx[txHash])));
                        }
                        break;
                    default:
                        break;
                }
            }, 1000);
        });
    }, 10000);
    test('Load new instance of Migrations', function (done) {
        vortex_1.Vortex.get().loadContract("Migrations", vortex_1.Vortex.get().Store.getState().web3.coinbase);
        var intervalId = setInterval(function () {
            var state = vortex_1.Vortex.get().Store.getState();
            switch (state.feed.length) {
                case 9:
                    if (state.feed[8].action === 'NEW_CONTRACT' && state.feed[8].contract_name === 'Migrations' && state.feed[8].contract_address === vortex_1.Vortex.get().Store.getState().web3.coinbase) {
                        clearInterval(intervalId);
                        done();
                    }
                    else
                        done(new Error("Invalid Feed element"));
                    break;
                default:
                    break;
            }
        }, 1000);
    }, 10000);
    test('Recover IPFS hash previously uploaded', function (done) {
        vortex_1.Vortex.get().Store.dispatch(ipfs_actions_1.IPFSLoad(IPFS_hash));
        var intervalId = setInterval(function () {
            var state = vortex_1.Vortex.get().Store.getState();
            if (state.ipfs[IPFS_hash]) {
                if (state.ipfs[IPFS_hash].error) {
                    done(state.ipfs[IPFS_hash].error);
                }
                else if (state.ipfs[IPFS_hash].content) {
                    clearInterval(intervalId);
                    done();
                }
            }
        }, 1000);
    }, 30000);
    test('Recover False IPFS hash', function (done) {
        vortex_1.Vortex.get().Store.dispatch(ipfs_actions_1.IPFSLoad(IPFS_fake_hash));
        var intervalId = setInterval(function () {
            var state = vortex_1.Vortex.get().Store.getState();
            if (state.ipfs[IPFS_fake_hash]) {
                if (state.ipfs[IPFS_fake_hash].error) {
                    clearInterval(intervalId);
                    done();
                }
                else if (state.ipfs[IPFS_fake_hash].content) {
                    done(new Error("Should have thrown"));
                }
            }
        }, 1000);
    }, 300000);
    test('Event Feed', function () {
        var state = vortex_1.Vortex.get().Store.getState();
        expect(state.event.event_feed.length).toBe(1);
    });
});
//# sourceMappingURL=vortex.manual.test.js.map