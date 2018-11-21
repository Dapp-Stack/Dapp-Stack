import { Structure } from '@dapp-stack/environment'
import * as deployer from '@dapp-stack/deployer'
import * as spawn from 'cross-spawn'
import * as path from 'path'

const mochaPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'mocha')

export const setup = async (migrate: (deployer: any) => Promise<void>) => {
  await deployer.run(migrate)
}

export const setupCoverage = () => {
  // coverage.prepare();
  // coverage.instrument();
}

export const run = () => {
  spawn.sync('node', [mochaPath, `${Structure.contracts.test}**/*Test.js`, '--reporter', 'spec'], {
    stdio: [process.stdin, process.stdout, process.stderr]
  })
}

export const finishCoverage = () => {
  // coverage.report();
}

export const cleanCoverage = () => {
  // coverage.clean();
}
