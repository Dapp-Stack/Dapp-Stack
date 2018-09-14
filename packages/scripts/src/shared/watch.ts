import { Environment } from '@solon/environment';
import * as chokidar from 'chokidar';
import * as path from 'path';
import { Signale } from 'signale';

import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';

export function watch(environment: Environment): void {
  const signale = new Signale({ scope: 'Watcher' });
  signale.success('Watcher started.');
  const contracts = environment.deploy.contracts.map(contract =>
    path.join(environment.structure.contracts.src, contract),
  );
  const watcher = chokidar.watch(contracts, { persistent: true });
  watcher.on('change', complileAndDeployAsync.bind(null, environment));
}

async function complileAndDeployAsync(environment: Environment, path: string): Promise<void> {
  const signale = new Signale({ scope: 'Watcher' });
  signale.await(`File Changed: ${path}`);
  const contractName = path.replace(environment.structure.contracts.src, '');
  await compiler.run(contractName, environment.compile);
  deployer.run(environment.deploy);
}
