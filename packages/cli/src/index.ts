#!/usr/bin/env node

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS PROJECT /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// solon-cli is installed globally on people's computers. This means
// that it is extremely difficult to have them upgrade the version and
// because there's only one global version installed, it is very prone to
// breaking changes.
//
// The only job of solon-cli is to init the repository and then
// forward all the commands to the local version of solon-cli.
//
// If you need to add a new command, please add it to the scripts/ folder.
//
// The only reason to modify this project is to add more warnings and
// troubleshooting information for the `solon-cli` command.
//
// Do not make breaking changes! We absolutely don't want to have to
// tell people to update their global version of solon-cli.
//
// Also be careful with new language features.
// This file must work on Node 8+.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS PROJECT /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import logger from './logger';

const currentNodeVersion: string = process.versions.node;
const semver: string[] = currentNodeVersion.split('.');
const major: number = parseInt(semver[0], 10);

if (major < 8) {
  logger.error(
    `You are running Node ${currentNodeVersion}.\nSolon requires Node 8 or higher.\n` +
      'Please update your version of Node.',
  );
  process.exit(1);
}

require('./program');
