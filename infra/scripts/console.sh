#!/usr/bin/env bash

docker-compose exec geth geth attach ipc:/root/.ethereum/$SOLON_ENV/geth.ipc;
