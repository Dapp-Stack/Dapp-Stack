#!/usr/bin/env bash

rm -rf ./data/geth/*/geth
rm -rf ./data/ipfs/*
docker-compose rm -f
docker-compose down --rmi all
