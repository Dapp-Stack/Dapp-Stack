import {ReducersMapObject} from "redux";
import {State} from "./stateInterface";
import {web3} from './web3/web3.reducers';
import {feed} from "./feed/feed.reducers";
import {tx} from "./tx/tx.reducers";
import {contracts} from './contracts/contracts.reducers';
import {accounts} from './accounts/accounts.reducers';
import {ipfs} from "./ipfs/ipfs.reducers";
import {backlink} from "./backlink/backlink.reducers";
import {event} from "./event/event.reducers";

export const reducers: ReducersMapObject<State> = {
    web3,
    tx,
    contracts,
    feed,
    accounts,
    ipfs,
    backlink,
    event
};
