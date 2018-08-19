#!/usr/bin/env sh

geth --datadir "/root/.ethereum/private" \
     init "/root/.ethereum/private/genesis.json"

geth --datadir "/root/.ethereum/private" \
     --networkid "9999" \
     --ws \
     --wsaddr "0.0.0.0" \
     --wsorigins "*" \
     --wsport "8546" \
     --rpc \
     --rpcapi "db,personal,eth,net,web3" \
     --rpcaddr "0.0.0.0" \
     --rpcport "8545" \
     --rpccorsdomain '*' \
     --mine \
     --nodiscover \
     --unlock 0,1,2,3 \
     --password /root/.ethereum/private/passwords
