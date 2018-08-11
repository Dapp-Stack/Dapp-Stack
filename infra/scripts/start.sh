#!/usr/bin/env bash

docker-compose -f infra/docker-compose.yml up -d;
docker-compose -f infra/docker-compose.yml logs > infra/logs/${SOLON_ENV}.log;
