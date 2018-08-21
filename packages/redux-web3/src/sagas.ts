import {all, fork, ForkEffect} from 'redux-saga/effects'
import {Web3Sagas} from './web3/web3.sagas';
import {TxSagas} from "./tx/tx.sagas";
import {ContractSagas} from "./contracts/contracts.saga";
import {AccountSagas} from "./accounts/accounts.saga";
import {IPFSSagas} from "./ipfs/ipfs.saga";
import {BacklinkSagas} from "./backlink/backlink.sagas";
import {EventSagas} from "./event/event.sagas";

export const rootSagaBuilder = (...customSagas: any[]): any => {

    return function* rootSaga(dispatch: (arg: any) => void): any {

        const sagas = ([Web3Sagas, TxSagas, ContractSagas.bind(null, dispatch), AccountSagas, IPFSSagas, BacklinkSagas.bind(null, dispatch), EventSagas, ...customSagas]).filter((elem: any): boolean => !!elem).map((elem: any): ForkEffect => {
            return fork(elem);
        });

        yield all(sagas)
    }

};

