import { EthereumNetwork } from '@dapp-stack/environment'
import * as ethers from 'ethers'
import { Signale } from 'signale'

const signale = new Signale({ scope: 'Connection' })

export const connect = (
  network: EthereumNetwork
): ethers.providers.JsonRpcProvider => {
  const provider = getProvider(network)
  checkConnection(provider)

  return provider
}

const getProvider = (network: EthereumNetwork) => {
  switch (network) {
    case 'dev':
    case 'external':
      return new ethers.providers.JsonRpcProvider()
    default:
      return new ethers.providers.InfuraProvider(network)
  }
}

const checkConnection = (provider: ethers.providers.Provider) => {
  provider
    .getBlockNumber()
    .then(() => {
      signale.success('Successfully connected to Ethereum.')
    })
    .catch(error => {
      signale.error('Error while connecting to Ethereum')
      signale.error(error)
      process.exit(1)
    })
}
