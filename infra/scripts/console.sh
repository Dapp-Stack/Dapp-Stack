#!/usr/bin/env bash

docker-compose -f docker-compose.yml exec geth geth attach ipc:/root/.ethereum/$SOLON_ENV/geth.ipc;
