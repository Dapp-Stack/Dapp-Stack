import {Reducer, ReducersMapObject} from "redux";
import {
    AccountStoreState,
    BacklinkState,
    ContractStoreState,
    EventState,
    FeedState,
    IPFSStoreState,
    State,
    TransactionStoreState,
    Web3State
} from "./stateInterface";

export const dummyReducer: ReducersMapObject<State> = {
    web3: {} as Reducer<Web3State>,
    tx: {} as Reducer<TransactionStoreState>,
    contracts: {} as Reducer<ContractStoreState>,
    feed: {} as Reducer<FeedState[]>,
    accounts: {} as Reducer<AccountStoreState>,
    ipfs: {} as Reducer<IPFSStoreState>,
    backlink: {} as Reducer<BacklinkState>,
    event: {} as Reducer<EventState>
};
