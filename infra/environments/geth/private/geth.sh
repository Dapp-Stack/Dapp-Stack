#!/usr/bin/env sh

geth --datadir "/root/.ethereum/private" \
     --networkid "1234" \
     --ws \
     --wsaddr "0.0.0.0" \
     --wsorigins "*" \
     --wsport "8446" \
     --rpc \
     --rpcapi "db,personal,eth,net,web3" \
     --rpcaddr "0.0.0.0" \
     --rpcport "8545" \
     --rpccorsdomain '*' \
     --nodiscover \
     --maxpeers 0 \
     --verbosity 5 \
     --mine \
     --unlock 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19 \
     --password /root/.ethereum/private/passwords \
     init "/root/.ethereum/private/genesis.json"

