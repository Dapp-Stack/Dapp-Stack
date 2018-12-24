import { build, Structure } from '@dapp-stack/environment'
import * as fs from 'fs-extra'
import * as globule from 'globule'
import * as path from 'path'
import { FunctionFragment, EventFragment } from 'ethers/utils/abi-coder'

export interface Artifact {
  contractName: string
  abi: Array<FunctionFragment | EventFragment>
  source: string
  sourcePath: string
  bytecode: string
  sourceMap?: string
  deployedBytecode: string
  deployedSourceMap?: string
}

export function sourcesPath() {
  return build().compile.contracts.map(name =>
    path.join(Structure.contracts.src, name)
  )
}

export function artifactsPath() {
  return globule.find(`${Structure.contracts.build}/**/*.json`)
}

export function findArtifact(contractName: string): Artifact {
  const artifact = artifacts().find(
    artifact => artifact.contractName === contractName
  )

  if (!artifact) {
    throw new Error(
      `Contract not found: ${contractName}, make sure this contract exists.`
    )
  }

  return artifact
}

export function artifacts(): Artifact[] {
  return artifactsPath().map(artifactPath => fs.readJSONSync(artifactPath))
}

export function solidityFilter(name: string) {
  return name.endsWith('.sol')
}

export function vyperFilter(name: string) {
  return name.endsWith('.vy')
}
