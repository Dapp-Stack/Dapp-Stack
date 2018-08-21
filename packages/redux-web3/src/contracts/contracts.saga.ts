import {call, put, take, takeEvery, takeLatest, select} from 'redux-saga/effects';

import {SagaIterator, eventChannel, END} from "redux-saga";
import {Unsubscribe} from "redux";
import {State, Web3LoadedState} from "../stateInterface";
import {FeedNewContract, FeedNewError, FeedNewTransaction} from "../feed/feed.actions";
import {Web3LoadedAction, Web3LoadError, Web3NetworkError} from "../web3/web3.actions";
import {VortexContract} from "./VortexContract";
import {
    ContractCallAction, ContractCompleteRefreshAction,
    ContractError,
    ContractLoadAction,
    ContractLoaded,
    ContractLoadInfos,
    ContractLoading, ContractPreloadDone,
    ContractSendAction, ContractSetDeployed,
    ContractVarErrorReceived,
    ContractVarForceRefresh,
    ContractVarReceived
} from "./contracts.actions";
import {
    TxBroadcasted,
    TxConfirmed,
    TxError,
    TxReceipt
} from "../tx/tx.actions";
import {Vortex} from "../vortex";
import {AccountUpdateRequest} from "../accounts/accounts.actions";
import {BN} from 'bn.js';

const toLower: string[] = [
    "to",
    "from",
    "gas",
    "gasPrice",
    "value"
];

export function runForceRefreshRoundOn(state: State, emit: (arg?: any) => void, contractName: string, instance_address: string): void {
    Object.keys(state.contracts[contractName][instance_address].instance.vortexMethods).forEach((methodName: string): void => {
        if (state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache) {
            Object.keys(state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache).forEach((signature: string): void => {
                if (state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache[signature].synced
                    && !state.contracts[contractName][instance_address].instance.vortexMethods[methodName].cache[signature].disable_refresh) {
                    emit(ContractVarForceRefresh(contractName, instance_address, methodName, signature));
                }
            })
        }
    });
}

export function runForceRefreshRound(state: State, emit: (arg?: any) => void): void {
    Object.keys(state.contracts).forEach((contractName: string): void => {
        Object.keys(state.contracts[contractName]).forEach((instance_address: string): void => {
            if (instance_address !== 'artifact' && state.contracts[contractName][instance_address].instance) {
                runForceRefreshRoundOn(state, emit, contractName, instance_address);
            }
        })
    });
}

function* backgroundContractLoad(): SagaIterator {

    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        const interval_id = setInterval((): void => {
            const state = Vortex.get().Store.getState();
            runForceRefreshRound(state, emit);
        }, 15000);

        return ((): void => {
            clearInterval(interval_id)
        });
    });
}

function* loadContract(contractName: string, contractAddress: string, userAddress: string, web3: any): SagaIterator {
    const contracts = (yield select()).contracts;
    const artifact = contracts[contractName] ? contracts[contractName].artifact : undefined;
    if (!artifact) {
        const error = new Error("Unable to recover artifact for contract " + contractName + ":" + contractAddress);
        yield put(ContractError(contractName, contractAddress, error));
        yield put(FeedNewError(error, error.message, "[contracts.saga.ts][loadContract] Trying to load artifact."));
        return;
    }
    if (contracts[contractName][contractAddress]) {
        console.warn("Contract already in store");
        return;
    }
    yield put(ContractLoading(contractName, contractAddress));
    let vortex_contract: any;
    try {
        vortex_contract = new VortexContract(artifact, contractAddress, userAddress, web3);
    } catch (e) {
        yield put(ContractError(contractName, contractAddress, e));
        yield put(FeedNewError(e, e.message, "[contracts.saga.ts][loadContract] Trying to instantiate VortexContract."));
        throw (e);
    }
    yield put(ContractLoaded(contractName, contractAddress, vortex_contract));
    yield put(FeedNewContract(contractName, contractAddress));
}

const compareBytecode = (address: string, bytecode: string, web3: any): Promise<boolean> => {
    return new Promise((ok: (arg: any) => void, ko: (arg: any) => void): void => {
        web3.eth.getCode(address).then((remote_bytecode: string): void => {
            if (remote_bytecode.indexOf('0x') === 0)
                remote_bytecode = remote_bytecode.substr(2);
            if (bytecode.indexOf('0x') === 0)
                bytecode = bytecode.substr(2);
            ok(bytecode.toLowerCase() === remote_bytecode.toLowerCase());
        }).catch(ko);
    });
};

function* onLoadContractInitialize(action: Web3LoadedAction): SagaIterator {
    const state = (yield select());
    const contracts = state.contracts;
    const backlink = state.backlink;
    const contractNames = Object.keys(contracts);
    switch (contracts.config.type) {
        case 'truffle':
            try {
                const recap: ContractLoadInfos[] = [];
                for (let idx = 0; idx < contractNames.length; ++idx) {
                    let contract_instance = undefined;
                    for (let save_contract_idx = 0; save_contract_idx < contracts.config.config.contracts.length; ++save_contract_idx) {
                        if (contracts.config.config.contracts[save_contract_idx].contractName === contractNames[idx]) {
                            contract_instance = contracts.config.config.contracts[save_contract_idx];
                            break ;
                        }
                    }
                    if (contract_instance && contract_instance.networks && contracts.config.config.preloaded_contracts.indexOf(contractNames[idx]) !== -1) {
                        if (contract_instance.networks[action.networkId] === undefined) {
                            console.warn("Contract " + contractNames[idx] + " has no instance on current network");
                            break;
                        }
                        yield* loadContract(contractNames[idx], contract_instance.networks[action.networkId].address.toLowerCase(), action.coinbase, action._);
                        yield put(ContractSetDeployed(contractNames[idx], contract_instance.networks[action.networkId].address));
                        recap.push({name: contractNames[idx], address: contract_instance.networks[action.networkId].address.toLowerCase()});
                    }
                }
                yield put(ContractPreloadDone(recap));
            } catch (e) {
                yield put(Web3LoadError(e))
            }
            break;
        case 'embark':
            try {
                const contract_infos = contracts.config.config.chains[action.networkId].contracts;
                const to_preload = contracts.config.config.preloaded_contracts;
                const recap: ContractLoadInfos[] = [];
                for (let idx = 0; idx < Object.keys(contract_infos).length; ++idx) {
                    const infos = contract_infos[Object.keys(contract_infos)[idx]];
                    if (to_preload.indexOf(infos.name) !== -1 && contracts[infos.name]) {
                        yield* loadContract(infos.name, infos.address.toLowerCase(), action.coinbase, action._);
                        yield put(ContractSetDeployed(infos.name, infos.address));
                        recap.push({name: infos.name, address: infos.address.toLowerCase()});
                    }
                }
                yield put(ContractPreloadDone(recap));
            } catch (e) {
                yield put(Web3LoadError(e));
            }
            break ;
        case 'manual':
            try {
                const config_contract = contracts.config.config.contracts;
                const recap: ContractLoadInfos[] = [];
                for (let idx = 0; idx < Object.keys(config_contract).length; ++idx) {
                    const infos = config_contract[Object.keys(config_contract)[idx]];
                    if (infos.at) {
                        if (infos.deployed_bytecode) {
                            const status: boolean = yield call(compareBytecode, infos.at, infos.deployed_bytecode, action._);
                            if (!status) {
                                yield put(Web3NetworkError(action.networkId));
                                break ;
                            }
                        }
                        yield* loadContract(Object.keys(config_contract)[idx], infos.at.toLowerCase(), action.coinbase, action._);
                        yield put(ContractSetDeployed(Object.keys(config_contract)[idx], infos.at));
                        recap.push({name: Object.keys(config_contract)[idx], address: infos.at.toLowerCase()});
                    }
                }
                yield put(ContractPreloadDone(recap));
            } catch (e) {
                yield put(Web3LoadError(e));
            }
    }
    if (backlink.status !== 'CONNECTED' && backlink.status !== 'LOADING') {
        const auto_refresh = yield call(backgroundContractLoad);
        try {
            while (true) {
                const time_to_update = yield take(auto_refresh);
                yield put(time_to_update);
            }
        } finally {
            auto_refresh.close();
        }
    }
}

function* contractCall(action: ContractCallAction, tx: any, arg_signature: string): SagaIterator {

    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        tx.call(action.transactionArgs).then((result: any) => {
            emit(ContractVarReceived(action.contractName, action.contractAddress, action.methodName, arg_signature, result));
            if (action.resolvers)
                action.resolvers.success(result);
        }).catch((error: any) => {
            emit(ContractVarErrorReceived(action.contractName, action.contractAddress, action.methodName, arg_signature, error));
            emit(FeedNewError(error, error.message, "[contracts.saga.ts][contractCall] Trying to recover constant call result."));
            if (action.resolvers)
                action.resolvers.error(error);
        });

        return ((): void => {
        });
    });

}

function* onContractCall(action: ContractCallAction): SagaIterator {
    action.contractAddress = action.contractAddress.toLowerCase();
    const contracts = (yield select()).contracts;
    const current_contract = contracts[action.contractName][action.contractAddress].instance;
    const arg_signature = VortexContract.callSignature(...action.methodArgs);

    if (!current_contract.vortexMethods[action.methodName].cache[arg_signature].synced) {
        const ctcall = yield call(contractCall, action, current_contract.methods[action.methodName](...action.methodArgs), arg_signature);
        try {
            while (true) {
                const resolution = yield take(ctcall);
                yield put(resolution);
            }
        } finally {
            ctcall.close();
        }
    }
}

function* contractSend(action: ContractSendAction, tx: any, web3: any): SagaIterator {

    let transaction_hash: string;
    let state: State = yield select();

    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        let tx_events = undefined;
        try {
            tx_events = tx.send(action.transactionArgs)
                .on('transactionHash', (_transaction_hash: string): void => {
                    transaction_hash = _transaction_hash;
                    if (action.resolvers) {
                        action.resolvers.success(_transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(FeedNewTransaction(_transaction_hash));
                    Object.keys(action.transactionArgs).forEach((key: string): void => {
                        if (toLower.indexOf(key) !== -1 && typeof(action.transactionArgs[key]) === 'string') {
                            action.transactionArgs[key] = action.transactionArgs[key].toLowerCase();
                        }
                    });
                    emit(TxBroadcasted(_transaction_hash, action.transactionArgs));
                })
                .on('confirmation', (_amount: number, _receipt: any): void => {
                    emit(TxConfirmed(transaction_hash, _receipt, _amount));
                    if (state.backlink.status !== 'CONNECTED' && state.backlink.status !== 'LOADING') {
                        if (!(_amount % 5) || _amount < 5) {
                            runForceRefreshRoundOn(state, emit, action.contractName, action.contractAddress);
                            if (action.transactionArgs.from)
                                emit(AccountUpdateRequest(action.transactionArgs.from));
                            if (action.transactionArgs.to)
                                emit(AccountUpdateRequest(action.transactionArgs.to));
                        }
                    }
                    if (_amount >= 24)
                        emit(END);
                })
                .on('receipt', (_receipt: any): void => {
                    web3.eth.getTransaction(transaction_hash).then((txInfos: any): void => {
                        Vortex.get().Store.dispatch(TxReceipt(transaction_hash, _receipt, {
                            from: txInfos.from.toLowerCase(),
                            to: txInfos.to.toLowerCase(),
                            gas: '0x' + (new BN(txInfos.gas)).toString(16).toLowerCase(),
                            gasPrice: '0x' + (new BN(txInfos.gasPrice)).toString(16).toLowerCase(),
                            data: txInfos.input,
                            nonce: txInfos.nonce,
                            value: '0x' + (new BN(txInfos.value)).toString(16).toLowerCase()
                        }));
                    });
                })
                .on('error', (_error: any): void => {
                    if (transaction_hash === undefined) {
                        transaction_hash = 'last';
                    }
                    emit(TxError(transaction_hash, _error));
                    emit(FeedNewError(_error, _error.message, "[contracts.sagas.ts][contractSend.error] Trying to send method call."));
                    if (action.resolvers) {
                        action.resolvers.error(transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(END);
                });
        } catch (reason) {
            if (transaction_hash === undefined) {
                transaction_hash = 'last';
            }
            Vortex.get().Store.dispatch(TxError(transaction_hash, reason));
            Vortex.get().Store.dispatch(FeedNewError(reason, reason.message, "[contracts.sagas.ts][contractSend.catch] Trying to send method call."));
            if (action.resolvers) {
                action.resolvers.error(transaction_hash);
                action.resolvers = undefined;
            }
            emit(END);
        }

        return ((): void => {
            tx_events.off()
        })
    });

}

function* onContractSend(action: ContractSendAction): SagaIterator {
    action.contractAddress = action.contractAddress.toLowerCase();
    const current_state = (yield select());
    const current_contract = current_state.contracts[action.contractName][action.contractAddress].instance;

    const ctsend = yield call(contractSend, action, current_contract.methods[action.methodName](...action.methodArgs), current_state.web3._);
    try {
        while (true) {
            const resolution = yield take(ctsend);
            yield put(resolution);
        }
    } finally {
        ctsend.close();
    }
}

function* onContractLoad(action: ContractLoadAction): SagaIterator {
    const {coinbase, _}: Web3LoadedState = (yield select()).web3;
    yield* loadContract(action.contractName, action.contractAddress, coinbase, _);
}

function* onContractCompleteRefresh(dispatch: (arg: any) => void, action: ContractCompleteRefreshAction): SagaIterator {
    const state = yield select();
    runForceRefreshRoundOn(state, dispatch, action.contract_name, action.contract_address);
}

export function* ContractSagas(dispatch: (arg: any) => void): any {
    yield takeLatest('LOADED_WEB3_BACKLINK', onLoadContractInitialize);
    yield takeEvery('CONTRACT_LOAD', onContractLoad);
    yield takeEvery('CONTRACT_CALL', onContractCall);
    yield takeEvery('CONTRACT_SEND', onContractSend);
    const boundOnContractCompleteRefresh = onContractCompleteRefresh.bind(null, dispatch);
    yield takeEvery('CONTRACT_COMPLETE_REFRESH', boundOnContractCompleteRefresh);
}
