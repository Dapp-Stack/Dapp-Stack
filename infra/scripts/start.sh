#!/usr/bin/env bash

docker-compose -f docker-compose.yml up -d;
docker-compose -f docker-compose.yml logs > logs/${SOLON_ENV}.log;
