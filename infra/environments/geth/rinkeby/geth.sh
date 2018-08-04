#!/usr/bin/env bash

geth --datadir=/root/.ethereum/rinkeby \
     --rinkeby \
     --rpcapi "db,personal,eth,net,web3" \
     --ws \
     --rpc \
