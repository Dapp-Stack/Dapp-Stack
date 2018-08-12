#!/usr/bin/env bash

if [ -z "$SOLON_ENV" ]
then
  echo "SOLON_ENV is required, please set us before continuing"
  exit 1;
fi

if [ "$SOLON_ENV" == "private" ]
then
  echo "[INFRA] Running private node";
elif [ "$SOLON_ENV" == "rinkeby" ] || [ "$SOLON_ENV" == "ropsten" ]
then
  echo "[INFRA] Warning: Running test node";
elif [ "$SOLON_ENV" == "frontier" ]
then
  echo "[INFRA] Danger: Running main node";
else
  echo "[INFRA] Error: SOLON_ENV is incorrect, please use: private, rinkeby, ropsten or frontier";
  exit 1;
fi
