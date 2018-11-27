import * as fs from 'fs'
import * as _ from 'lodash'
import * as path from 'path'

export interface Dependencies {
  [depName: string]: string
}

export interface PackageJSON {
  private?: boolean
  version: string
  name: string
  main?: string
  scripts?: { [command: string]: string }
  config?: {
    additionalTsTypings?: string[]
  }
  dependencies: Dependencies
  devDependencies: Dependencies
}

export interface Package {
  location: string
  packageJson: PackageJSON
}

const ROOT_DIR = path.join(__dirname, '../../../..')

export function findPackages(): Package[] {
  const rootPackageJsonString = fs.readFileSync(
    `${ROOT_DIR}/package.json`,
    'utf8'
  )
  const rootPackageJson = JSON.parse(rootPackageJsonString)
  const packages = []

  for (const workspace of rootPackageJson.workspaces) {
    const workspacePath = workspace.replace('*', '').replace('**/*', '')
    const subpackageNames = fs.readdirSync(`${ROOT_DIR}/${workspacePath}`)

    for (const subpackageName of subpackageNames) {
      const pathToPackageJson = `${ROOT_DIR}/${workspacePath}${subpackageName}`
      const packageJsonString = fs.readFileSync(
        `${pathToPackageJson}/package.json`,
        'utf8'
      )

      packages.push({
        location: pathToPackageJson,
        packageJson: JSON.parse(packageJsonString)
      })
    }
  }

  return packages
}
