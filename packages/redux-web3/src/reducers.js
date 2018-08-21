"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_reducers_1 = require("./web3/web3.reducers");
var feed_reducers_1 = require("./feed/feed.reducers");
var tx_reducers_1 = require("./tx/tx.reducers");
var contracts_reducers_1 = require("./contracts/contracts.reducers");
var accounts_reducers_1 = require("./accounts/accounts.reducers");
var ipfs_reducers_1 = require("./ipfs/ipfs.reducers");
var backlink_reducers_1 = require("./backlink/backlink.reducers");
var event_reducers_1 = require("./event/event.reducers");
exports.reducers = {
    web3: web3_reducers_1.web3,
    tx: tx_reducers_1.tx,
    contracts: contracts_reducers_1.contracts,
    feed: feed_reducers_1.feed,
    accounts: accounts_reducers_1.accounts,
    ipfs: ipfs_reducers_1.ipfs,
    backlink: backlink_reducers_1.backlink,
    event: event_reducers_1.event
};
//# sourceMappingURL=reducers.js.map