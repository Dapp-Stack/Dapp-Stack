import { build, Structure } from '@dapp-stack/environment'
import * as chokidar from 'chokidar'
import * as path from 'path'
import { Signale } from 'signale'

import * as compiler from '@dapp-stack/compiler'
import * as deployer from '@dapp-stack/deployer'
import * as doc from '@dapp-stack/doc'

export function watch(): void {
  const compile = build().compile
  const signale = new Signale({ scope: 'Watcher' })
  signale.success('Watcher started.')
  const contracts = compile.contracts.map(contract =>
    path.join(Structure.contracts.src, contract)
  )
  const watcher = chokidar.watch(contracts, { persistent: true })
  watcher.on('change', complileAndDeployAsync.bind(null))
}

async function complileAndDeployAsync(path: string) {
  const signale = new Signale({ scope: 'Watcher' })
  signale.await(`File Changed: ${path}`)
  try {
    await doc.run(path)
    await compiler.run()
    await deployer.run()
  } catch (error) {
    signale.error(error)
  }
}
