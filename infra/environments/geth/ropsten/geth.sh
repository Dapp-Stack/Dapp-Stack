#!/usr/bin/env bash

geth --datadir=/root/.ethereum/ropsten \
     --testnet \
     --rpcapi "db,personal,eth,net,web3" \
     --ws \
     --rpc \
