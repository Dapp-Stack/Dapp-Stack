#!/usr/bin/env node
import * as _ from 'lodash'

import { logger } from './logger'
import {
  Dependencies,
  findPackages,
  Package,
  PackageJSON
} from './packageHelper'

interface Versions {
  [packageName: string]: string
}
interface VersionsByDependency {
  [depName: string]: Versions
}

function flatDependencies(packageJson: PackageJSON): Dependencies {
  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }
}

function loadVersionsByDependency(): VersionsByDependency {
  const versionsByDependency: VersionsByDependency = {}

  findPackages().map((pkg: Package) => {
    const dependencies = flatDependencies(pkg.packageJson)

    _.map(dependencies, (version: string, depName: string) => {
      if (_.isUndefined(versionsByDependency[depName])) {
        versionsByDependency[depName] = {}
      }
      versionsByDependency[depName][pkg.packageJson.name] = version
    })
  })

  return versionsByDependency
}

function print(versions: Versions, name: string): void {
  if (_.uniq(_.values(versions)).length === 1) {
    return
  }
  logger.bold(name)
  _.each(versions, (version: string, packageName: string) => {
    logger.info(`├── ${packageName} -> ${version}`)
  })
}

export function checkDependenciesVersions(): void {
  const versionsByDependency = loadVersionsByDependency()
  _.each(versionsByDependency, print)
}

checkDependenciesVersions()
