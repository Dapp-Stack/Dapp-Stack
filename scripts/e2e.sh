#!/usr/bin/env bash

mkdir contractsOnly;
cd contractsOnly;
../packages/cli/bin/index.js;

cd ../;

npx create-react-app cra;
cd cra;
../packages/cli/bin/index.js;
