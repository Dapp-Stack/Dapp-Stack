#!/usr/bin/env node

import * as depcheckAsync from 'depcheck'
import * as _ from 'lodash'

import { logger } from './logger'
import { findPackages } from './packageHelper'

export async function findUnusedDependencies() {
  logger.bold(
    '*** NOTE: Not all deps listed here are actually not required. ***'
  )
  logger.bold(
    "*** `depcheck` isn't perfect so double check before actually removing any. ***\n"
  )
  const packages = findPackages()
  for (const pkg of packages) {
    logger.info(
      `Checking ${
        pkg.packageJson.name
      } for unused deps. This might take a while...`
    )

    const configs = {}
    const { dependencies } = await depcheckAsync(pkg.location, configs)
    if (!_.isEmpty(dependencies)) {
      _.each(dependencies, dep => logger.info(dep))
    }
    logger.info('\n')
  }
}

findUnusedDependencies()
  .then()
  .catch()
