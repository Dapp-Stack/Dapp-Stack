#!/usr/bin/env node

const config = require('../config');

config[process.env.SOLON_ENV]();
