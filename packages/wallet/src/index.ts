import { connect } from '@dapp-stack/connect'
import { build, EthereumNetwork, Maybe } from '@dapp-stack/environment'
import * as ethers from 'ethers'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as keythereum from 'keythereum'
import { Signale } from 'signale'

const signale = new Signale({ scope: 'Wallet' })

export interface WalletEnhanced {
  provider?: ethers.providers.JsonRpcProvider
  signer?: ethers.Signer
  address?: string
  balance: ethers.utils.BigNumber
}

export const generateWallet = async (
  network: Maybe<EthereumNetwork> = false,
  mnemonic?: string
): Promise<WalletEnhanced> => {
  if (!network || !mnemonic) {
    const ethereum = build().ethereum
    if (!ethereum) {
      return { balance: new ethers.utils.BigNumber(0) }
    }

    network = ethereum.network
    mnemonic = ethereum.mnemonic
  }

  const provider = connect(network)

  if (network === 'dev') {
    return devWallet(provider)
  }

  if (mnemonic) {
    return mnemonicWallet(mnemonic, provider)
  }

  return { provider, balance: new ethers.utils.BigNumber(0) }
}

const devWallet = async (
  provider: ethers.providers.JsonRpcProvider
): Promise<WalletEnhanced> => {
  const addresses = await provider.listAccounts()
  const address = addresses[0]
  const balance = await provider.getBalance(address)
  const signer = provider.getSigner()

  signale.success('Dev Wallet:')
  signale.success(`Address: ${address}`)
  signale.success(`Balance: ${ethers.utils.formatEther(balance)} Eth`)

  if (process.env.DAPP_ENV !== 'test') {
    const privateKey = getPrivateKey()
    signale.success(`Private key: ${privateKey}`)
  }

  return { provider, address, balance, signer }
}

const getPrivateKey = () => {
  signale.await('Generating private key...')
  const keystore = path.join(process.cwd(), '.geth', 'keystore')
  const filename = fs.readdirSync(keystore)[0]
  const keyObject = fs.readJSONSync(path.join(keystore, filename))
  return keythereum.recover('', keyObject).toString('hex')
}

const mnemonicWallet = async (
  mnemonic: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<WalletEnhanced> => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider)
  const balance = await wallet.getBalance()

  signale.success('Mnemonic Wallet:')
  signale.success(`Address: ${wallet.address}`)
  signale.success(`Balance: ${ethers.utils.formatEther(balance)} Eth`)
  signale.success(`Mnemonic: ${mnemonic}`)
  return { address: wallet.address, signer: wallet, balance, provider }
}
