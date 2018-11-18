import { build, EthereumNetwork } from '@solon/environment';
import { EthererumDeployer } from './ethereum/deployer';
import { generateWallet } from '@solon/wallet';
import { Signale } from 'signale';

const signale = new Signale({ scope: 'Deployer' });

export const run = async (extraMigrate: (deployer: EthererumDeployer) => void = () => {}) => {
  const { ethereum, web } = build();
  if (!ethereum) return;

  const wallet = await generateWallet();
  if (!wallet.provider) {
    return;
  }
  if (!wallet.signer || wallet.balance.eq(0)) {
    signale.error('Skipping contract deployment due to unsuficient fund, Did you set the mnemonic?');
    return;
  }

  const deployer = new EthererumDeployer(ethereum, web, wallet.signer);
  await deployer.initialize();
  await deployer.run(extraMigrate);
};
