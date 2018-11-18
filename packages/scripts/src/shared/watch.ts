import { build, Structure } from '@solon/environment';
import * as chokidar from 'chokidar';
import * as path from 'path';
import { Signale } from 'signale';

import * as compiler from '@solon/compiler';
import * as deployer from '@solon/deployer';
import * as doc from '@solon/doc';

export function watch(): void {
  const compile = build().compile;
  const signale = new Signale({ scope: 'Watcher' });
  signale.success('Watcher started.');
  const contracts = compile.contracts.map(contract => path.join(Structure.contracts.src, contract));
  const watcher = chokidar.watch(contracts, { persistent: true });
  watcher.on('change', complileAndDeployAsync.bind(null));
}

async function complileAndDeployAsync(path: string) {
  const signale = new Signale({ scope: 'Watcher' });
  signale.await(`File Changed: ${path}`);
  doc.run(path);
  await compiler.run();
  deployer.run();
}
