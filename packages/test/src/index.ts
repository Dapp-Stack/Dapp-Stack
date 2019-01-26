import { build, Structure } from '@dapp-stack/environment'
import * as deployer from '@dapp-stack/deployer'
import * as spawn from 'cross-spawn'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'

import { Coverage } from './coverage'

const signale = new Signale({ scope: 'Test' })
const mochaPath = path.resolve(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'mocha'
)

const istanbulPath = path.resolve(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'istanbul'
)
const coverage = new Coverage()

export const setup = async (migrate: (_deployer: any) => Promise<void>) => {
  const environment = build()
  const { ethereum, web } = environment
  if (!ethereum || ethereum.network !== 'dev') {
    signale.error(
      'Test cannot run if ethereum is not configured with dev network'
    )
    process.exit(1)
    return
  }

  if (web.framework !== 'test') {
    signale.error(
      'Test cannot run if web is not configured with test framework'
    )
    process.exit(1)
    return
  }
  ethereum.migrate = migrate
  await deployer.run(ethereum, environment.web)

  return
}

export const setupCoverage = async () => {
  if (process.env.COVERAGE) {
    const contracts = Object.values(build().compile.solidity).reduce(
      (acc, contracts) => acc.concat(contracts),
      []
    )
    await coverage.setup(contracts)
  }
}

export const run = () => {
  const env = Object.create(process.env)
  env.KEEP_TRACKER = true
  spawn.sync(
    'node',
    [mochaPath, `${Structure.contracts.test}**/*Test.js`, '--reporter', 'spec'],
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      env
    }
  )
}

export const finish = async () => {
  const environment = build()
  if (process.env.COVERAGE) {
    await coverage.registerContracts(environment.web.framework)
    await coverage.finish()

    spawn.sync(
      'node',
      [
        istanbulPath,
        'report',
        '--root',
        Structure.contracts.coverage,
        '--dir',
        Structure.contracts.coverage,
        '--format',
        'html'
      ],
      {
        stdio: [process.stdin, process.stdout, process.stderr]
      }
    )
  }

  const trackerPath = Structure.tracker(environment.web.framework)
  fs.unlinkSync(trackerPath)
}
