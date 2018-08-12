#!/usr/bin/env sh

geth --datadir "/root/.ethereum/private" \
     --networkid "1234" \
     --ws \
     --wsaddr "0.0.0.0" \
     --wsorigins "*" \
     --wsport "8546" \
     --rpc \
     --rpcapi "db,personal,eth,net,web3" \
     --rpcaddr "0.0.0.0" \
     --rpcport "8545" \
     --rpccorsdomain '*' \
     --unlock 0,1,2,3 \
     --mine \
     --password /root/.ethereum/private/passwords \
     --dev \
     init "/root/.ethereum/private/genesis.json"

#--nodiscover \
#     --maxpeers 1 \
#     --verbosity 5 \
#     --mine \
#     --dev \

