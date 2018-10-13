import { Structure } from '@solon/environment';
import { testRun } from '@solon/deployer';
import * as spawn from 'cross-spawn';
import * as GanacheCore from 'ganache-core';
import * as path from 'path';
import * as ethers from 'ethers';

import { Coverage } from './coverage';

const mochaPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'mocha');
const coverage = new Coverage();

export const setup = async (migrate: (deployer: any) => {}, ganacheOptions = {}) => {
  const ganache = GanacheCore.provider(ganacheOptions);
  const provider = new ethers.providers.Web3Provider(ganache);
  await testRun(migrate, provider.getSigner());
};

export const setupCoverage = () => {
  coverage.prepare();
  coverage.instrument();
}

export const run = () => {
  spawn.sync('node', [mochaPath, `${Structure.contracts.test}**/*Test.js`, '--reporter', 'spec'], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  
};

export const finishCoverage = () => {
  coverage.report();
}

export const cleanCoverage = () => {
  coverage.clean();
}