import { build, Structure } from '@dapp-stack/environment'
import * as deployer from '@dapp-stack/deployer'
import * as spawn from 'cross-spawn'
import * as path from 'path'
import { Signale } from 'signale'

const signale = new Signale({ scope: 'Test' })
const mochaPath = path.resolve(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'mocha'
)

export const setup = async (migrate: (deployer: any) => Promise<void>) => {
  const environment = build()
  const ethereum = environment.ethereum
  if (!ethereum) {
    signale.error(
      'Test cannot run if ethereum is not configured in the test enviornment.'
    )
    process.exit(1)
    return
  }
  ethereum.migrate = migrate
  await deployer.run(ethereum, environment.web)
  return
}

export const setupCoverage = () => {
  // coverage.prepare();
  // coverage.instrument();
}

export const run = () => {
  spawn.sync(
    'node',
    [mochaPath, `${Structure.contracts.test}**/*Test.js`, '--reporter', 'spec'],
    {
      stdio: [process.stdin, process.stdout, process.stderr]
    }
  )
}

export const finishCoverage = () => {
  // coverage.report();
}

export const cleanCoverage = () => {
  // coverage.clean();
}
