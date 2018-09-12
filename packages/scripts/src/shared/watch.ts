import { Environment } from '@solon/environment';
import * as chokidar from 'chokidar';
import * as path from 'path';
import { Signale } from 'signale';

import { compile } from './compile';
import { deploy } from './deploy';

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
  await compile(contractName, environment);
  deploy(environment);
}
