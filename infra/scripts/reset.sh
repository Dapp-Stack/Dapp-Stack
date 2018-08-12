#!/usr/bin/env bash

rm -rf ./data/geth/*/geth
rm -rf ./data/geth/*/geth.ipc
rm -rf ./data/ipfs/*
docker-compose rm -f
docker-compose down --rmi all
