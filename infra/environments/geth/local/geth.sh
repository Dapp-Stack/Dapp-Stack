#!/usr/bin/env sh

geth --datadir "/root/.ethereum/local" \
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
      --etherbase "7df9a875a174b3bc565e6424a0050ebc1b2d1d82"
     init "/root/files/local/genesis.json"
