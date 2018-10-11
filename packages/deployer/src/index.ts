import { build, EthereumNetwork } from '@solon/environment';
import { EthererumDeployer } from './ethereum/deployer';
import { generateWallet } from '@solon/wallet';
import { Signale } from 'signale';
import { ethers } from 'ethers';

const signale = new Signale({ scope: 'Deployer' });

export const run = async () => {
  const config = build().services.ethereum;
  if (!config) return;

  const wallet = await generateWallet();
  if (!wallet.provider) {
    return;
  }
  if (!wallet.signer || wallet.balance.eq(0)) {
    signale.error('Skipping contract deployment due to unsuficient fund, Did you set the mnemonic?');
    return;
  }

  const deployer = new EthererumDeployer(config, wallet.signer);
  await deployer.initialize();
  await deployer.run();
};

export const testRun = async (migrate: (deployer: EthererumDeployer) => {}, signer: ethers.Signer) => {
  const config = {
    network: 'ganache' as EthereumNetwork,
    migrate,
  };

  const deployer = new EthererumDeployer(config, signer);
  await deployer.initialize();
  await deployer.run();
};
