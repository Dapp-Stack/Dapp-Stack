#!/usr/bin/env bash

docker-compose -f infra/docker-compose.yml exec geth geth attach ipc:/root/.ethereum/local/geth.ipc;
