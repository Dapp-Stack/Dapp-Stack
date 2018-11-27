import * as ethers from 'ethers'

export type ContractsState = { [name: string]: ethers.Contract }

export interface BuildContractsInput {
  [address: string]: {
    name: string
    abi: string
  }
}
