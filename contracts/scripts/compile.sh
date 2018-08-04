#!/usr/bin/env bash

for f in $(find contracts/solidity -type f -name '*.sol')
do
  echo "Compiling $f file..."
  docker-compose -f contracts/docker-compose.yml run solidity \
    -o /build \
    --allow-paths /contracts/solidity \
    --optimize \
    --abi \
    --bin \
    --bin-runtime \
    --metadata \
    --ast \
    --asm \
    --overwrite \
    /$f;
done
