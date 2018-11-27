import * as ethers from 'ethers'
import { BuildContractsInput, ContractsState } from '../types'

declare global {
  interface Window {
    web3?: any
    ethereum?: any
  }
}

const error = new Error(
  'Non-Ethereum browser detected. You should consider trying MetaMask!'
)

export const connect = () => {
  return new Promise<ethers.providers.Web3Provider>(async (resolve, reject) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      return resolve(provider)
    } else if (window.web3) {
      const provider = new ethers.providers.Web3Provider(
        window.web3.currentProvider
      )
      return resolve(provider)
    } else {
      return reject()
    }
  })
}

export const getNetwork = (
  provider: ethers.providers.Web3Provider | undefined
) => {
  return new Promise<ethers.utils.Network>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getNetwork()
      .then(resolve)
      .catch(reject)
  })
}

export const getGasPrice = async (
  provider: ethers.providers.Web3Provider | undefined
) => {
  return new Promise<ethers.utils.BigNumber>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getGasPrice()
      .then(resolve)
      .catch(reject)
  })
}

export const getAddress = async (
  provider: ethers.providers.Web3Provider | undefined
) => {
  return new Promise<string>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getSigner()
      .getAddress()
      .then(resolve)
      .catch(reject)
  })
}

export const getBlockNumber = async (
  provider: ethers.providers.Web3Provider | undefined
) => {
  return new Promise<number>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getBlockNumber()
      .then(resolve)
      .catch(reject)
  })
}

export const getTransactionCount = async (
  provider: ethers.providers.Web3Provider | undefined
) => {
  return new Promise<number>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getSigner()
      .getTransactionCount()
      .then(resolve)
      .catch(reject)
  })
}

export const getBlock = async (
  provider: ethers.providers.Web3Provider | undefined,
  blockNumber: number
) => {
  return new Promise<ethers.providers.Block>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getBlock(blockNumber)
      .then(resolve)
      .catch(reject)
  })
}

export const getTransaction = async (
  provider: ethers.providers.Web3Provider | undefined,
  hash: string
) => {
  return new Promise<ethers.providers.TransactionResponse>(
    (resolve, reject) => {
      if (!provider) return reject(error)
      return provider
        .getTransaction(hash)
        .then(resolve)
        .catch(reject)
    }
  )
}

export const getBalance = async (
  provider: ethers.providers.Web3Provider | undefined
) => {
  return new Promise<ethers.utils.BigNumber>((resolve, reject) => {
    if (!provider) return reject(error)
    return provider
      .getSigner()
      .getBalance()
      .then(resolve)
      .catch(reject)
  })
}

export const getContracts = (
  provider: ethers.providers.Web3Provider | undefined,
  input: BuildContractsInput
) => {
  return new Promise<ContractsState>((resolve, reject) => {
    if (!provider) return reject(error)
    const addresses = Object.keys(input)
    const contracts = addresses.reduce((acc: ContractsState, address) => {
      acc[input[address].name] = new ethers.Contract(
        address,
        input[address].abi,
        provider.getSigner()
      )
      return acc
    }, {})
    resolve(contracts)
  })
}
