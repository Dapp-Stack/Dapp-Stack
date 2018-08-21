declare var describe: any;
declare var test: any;
declare var expect: any;
declare var Buffer: any;

import {Vortex} from "./vortex";
import * as Migrations from '../../setup/truffle/build/contracts/Migrations.json';
import {FeedNewTransaction, FeedNewContract} from "./feed/feed.actions";
import * as Web3 from "web3";
import {
    FeedNewContractState,
    FeedNewTransactionState,
    IPFSContentState,
    IPFSErrorState,
    Web3LoadedState
} from "./stateInterface";
import * as IPFSApi from 'ipfs-api';
import {IPFSLoad} from "./ipfs/ipfs.actions";
import {SagaIterator} from "redux-saga";
import {takeEvery} from "redux-saga/effects";
import {EventAdd} from "./event/event.actions";

const IPFS = IPFSApi('ipfs.infura.io', '5001', {protocol: 'https'});
let IPFS_hash;
const IPFS_fake_hash = "QmaoJEsqFkHETuCzGukYtfdJFCgNa2JKVNmdMbNdtRwszB";
const to_ipfs = new Buffer("ABCDEF");
let _web3;

const getWeb3: Promise<any> = new Promise<any>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
    try {
        _web3 = new (<any>Web3)(new (<any>Web3).providers.HttpProvider("http://localhost:8546"));
        ok(_web3);
    } catch (e) {
        ko(e);
    }
});

let sagaDone = {
    done: null
};

function* onLoaded(action: any): SagaIterator {
    sagaDone.done();
}

function* testSaga(): any {
    yield takeEvery('LOAD_WEB3', onLoaded);
}

describe("Vortex", () => {
    test('Instantiate', () => {
        const vtx = Vortex.factory({
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

    test("IPFS Push", (done) => {
        IPFS.files.add(to_ipfs).then((res) => {
            IPFS_hash = res[0].hash;
            done();
        })
    }, 60000);

    test('Recover Instance', () => {
        expect(Vortex.get().Contracts.manual_contracts['Migrations']).not.toBe(undefined);
    });

    test('Run Instance', () => {
        Vortex.get().run();
    });

    test('Load Web3', (done) => {
        sagaDone.done = done;
        Vortex.get().loadWeb3();
    });

    test('Add Event', (done) => {
        setTimeout((): void => {
            Vortex.get().Store.dispatch(EventAdd("Migrations", Migrations.networks[Object.keys(Migrations.networks)[0]].address, "Test"));
            done();
        }, 10000);
    }, 30000);

    test('Check Coinbase Balance', (done) => {
        setTimeout((): void => {
            done(expect(Vortex.get().Store.getState().accounts.coinbase).not.toBe(undefined));
        }, 1000);
    });

    test('Get accounts and follow them', (done) => {
        _web3.eth.getAccounts().then(acc => {
            Vortex.get().subscribeAccount(acc[1]);
            setTimeout((): void => {
                done(expect(Vortex.get().Store.getState().accounts[acc[1].toLowerCase()]).not.toBe(undefined));
            }, 1000);
        });
    });

    test('Send New Transaction from dispatch', (done: (arg?: any) => void) => {
        _web3.eth.getAccounts().then((acc: string[]) => {
            Vortex.get().Store.dispatch({
                type: 'TX_SEND',
                txArgs: {
                    from: acc[0],
                    to: acc[1],
                    value: 1234
                },
                web3: _web3
            })
        });
        let intervalId = setInterval(() => {
            const state = Vortex.get().Store.getState();
            switch (state.feed.length) {
                case 4:
                    const txHash = (<FeedNewTransactionState>state.feed[3]).transaction_hash;
                    if (state.tx[txHash].status.type === 'RECEIPT') {
                        clearInterval(intervalId);
                        done();
                    }
                    if (state.tx[txHash].status.type === 'ERROR') {
                        clearInterval(intervalId);
                        done(new Error(JSON.stringify(state.tx[txHash])));
                    }
                    break ;
                default:
                    break ;
            }
        }, 1000);
    }, 10000);

    test('Send New Transaction from web3', (done: (arg?: any) => void) => {
        _web3.eth.getAccounts().then((acc: string[]) => {
            _web3.eth.vortexSendTransaction({
                from: acc[0],
                to: acc[1],
                value: 1234
            })
        });
        let intervalId = setInterval(() => {
            const state = Vortex.get().Store.getState();
            switch (state.feed.length) {
                case 5:
                    const txHash = (<FeedNewTransactionState>state.feed[4]).transaction_hash;
                    if (state.tx[txHash].status.type === 'RECEIPT') {
                        clearInterval(intervalId);
                        done();
                    }
                    if (state.tx[txHash].status.type === 'ERROR') {
                        clearInterval(intervalId);
                        done(new Error(JSON.stringify(state.tx[txHash])));
                    }
                    break ;
                default:
                    break ;
            }
        }, 1000);
    }, 10000);

    test('Adding New Transaction to Feed', () => {
        Vortex.get().Store.dispatch(FeedNewTransaction("Dummy Tx"));
        expect(Vortex.get().Store.getState().feed[5].action).toBe('NEW_TRANSACTION');
    });

    test('Adding New Contract to Feed', () => {
        Vortex.get().Store.dispatch(FeedNewContract("Dummy Tx", "0xabcd"));
        expect(Vortex.get().Store.getState().feed[6].action).toBe('NEW_CONTRACT');
    });

    test('Recover Owner from constant call', (done: any): void => {
        const state = Vortex.get().Store.getState();
        const contractName = (<FeedNewContractState>state.feed[0]).contract_name;
        const contractAddress = (<FeedNewContractState>state.feed[0]).contract_address.toLowerCase();
        const contract = state.contracts[contractName][contractAddress].instance;
        contract.vortexMethods.owner.call().then((res: any): void => {
            if (contract.vortexMethods.owner.data() === res) {
                done();
            }
        }).catch((e: any): void => {
            done(e);
        })
    });

    test('Call State modifying method, expect txHash and new tx', (done: any): void => {
        const state = Vortex.get().Store.getState();
        const coinbase = (<Web3LoadedState>state.web3).coinbase;
        const contractName = (<FeedNewContractState>state.feed[0]).contract_name;
        const contractAddress = (<FeedNewContractState>state.feed[0]).contract_address;
        const contract = state.contracts[contractName][contractAddress].instance;

        contract.vortexMethods.setCompleted.send(23, {from: coinbase}).then((_txHash: string): void => {
            let intervalId = setInterval(() => {
                const state = Vortex.get().Store.getState();
                switch (state.feed.length) {
                    case 8  :
                        const txHash = (<FeedNewTransactionState>state.feed[7]).transaction_hash;
                        if (state.tx[txHash].status.type === 'RECEIPT') {
                            clearInterval(intervalId);
                            done();
                        }
                        if (state.tx[txHash].status.type === 'ERROR') {
                            clearInterval(intervalId);
                            done(new Error(JSON.stringify(state.tx[txHash])));
                        }
                        break ;
                    default:
                        break ;
                }
            }, 1000);

        });
    }, 10000);

    test('Load new instance of Migrations', (done: (arg?: any) => void) => {
        Vortex.get().loadContract("Migrations", (<Web3LoadedState>Vortex.get().Store.getState().web3).coinbase);
        let intervalId = setInterval(() => {
            const state = Vortex.get().Store.getState();
            switch (state.feed.length) {
                case 9:
                    if (state.feed[8].action === 'NEW_CONTRACT' && (<FeedNewContractState>state.feed[8]).contract_name === 'Migrations' && (<FeedNewContractState>state.feed[8]).contract_address === (<Web3LoadedState>Vortex.get().Store.getState().web3).coinbase) {
                        clearInterval(intervalId);
                        done();
                    } else
                        done(new Error("Invalid Feed element"));
                    break ;
                default:
                    break ;
            }
        }, 1000);
    }, 10000);

    test('Recover IPFS hash previously uploaded', (done) => {
        Vortex.get().Store.dispatch(IPFSLoad(IPFS_hash));
        let intervalId = setInterval(() => {
            const state = Vortex.get().Store.getState();
            if (state.ipfs[IPFS_hash]) {
                if ((<IPFSErrorState>state.ipfs[IPFS_hash]).error) {
                    done((<IPFSErrorState>state.ipfs[IPFS_hash]).error);
                } else if ((<IPFSContentState>state.ipfs[IPFS_hash]).content) {
                    clearInterval(intervalId);
                    done();
                }
            }
        }, 1000);
    }, 30000);

    test('Recover False IPFS hash', (done) => {
        Vortex.get().Store.dispatch(IPFSLoad(IPFS_fake_hash));
        let intervalId = setInterval(() => {
            const state = Vortex.get().Store.getState();
            if (state.ipfs[IPFS_fake_hash]) {
                if ((<IPFSErrorState>state.ipfs[IPFS_fake_hash]).error) {
                    clearInterval(intervalId);
                    done();
                } else if ((<IPFSContentState>state.ipfs[IPFS_fake_hash]).content) {
                    done(new Error("Should have thrown"));
                }
            }
        }, 1000);
    }, 300000);

    test('Event Feed', () => {
        const state = Vortex.get().Store.getState();
        expect(state.event.event_feed.length).toBe(1);
    })

});
