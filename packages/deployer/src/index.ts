import { build, Ethereum, Web, Maybe } from '@dapp-stack/environment'
import { EthererumDeployer } from './ethereum/deployer'
import { generateWallet } from '@dapp-stack/wallet'
import { Signale } from 'signale'

const signale = new Signale({ scope: 'Deployer' })

export const run = async (
  ethereum: Maybe<Ethereum> = false,
  web: Maybe<Web> = false
) => {
  if (!ethereum || !web) {
    const environment = build()
    ethereum = environment.ethereum
    web = environment.web
  }

  if (!ethereum) return

  const wallet = await generateWallet(ethereum.network, ethereum.mnemonic)
  if (!wallet.provider) {
    return
  }
  if (!wallet.signer || wallet.balance.eq(0)) {
    signale.error(
      'Skipping contract deployment due to unsuficient fund, Did you set the mnemonic?'
    )
    return
  }

  const deployer = new EthererumDeployer(ethereum, web, wallet.signer)
  await deployer.initialize()
  await deployer.run()
}
