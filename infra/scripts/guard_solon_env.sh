#!/usr/bin/env bash

if [ -z "$SOLON_ENV" ]
then
  echo "SOLON_ENV is required, please set us before continuing"
  exit 1;
fi
