import { build, Structure, Solidity } from '@dapp-stack/environment'
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

export function solidityContracts(): Solidity {
  const contracts = build().compile.solidity
  return Object.keys(contracts).reduce((acc: Solidity, version) => {
    acc[version] = contracts[version].map(name =>
      path.join(Structure.contracts.src, name)
    )
    return acc
  }, {})
}

export function soliditySourcePath() {
  return Object.values(solidityContracts()).reduce(
    (acc, contracts) => acc.concat(contracts),
    []
  )
}

export function vyperContracts() {
  return build().compile.vyper.map(name =>
    path.join(Structure.contracts.src, name)
  )
}

export function allContracts() {
  return globule.find(`${Structure.contracts.src}/**/*.{sol,vy}`)
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
