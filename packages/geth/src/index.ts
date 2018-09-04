import * as Docker from 'dockerode';
import { Environment } from '@solon/environment';
import { Signale } from 'signale';

let docker = new Docker();

export function start(environment: Environment, signale: Signale) {
  if (!environment.services.geth) {
    return;
  }
  return docker.run('ethereum/solc:0.4.24', command, process.stdout, options).then(function(container) {
    return container.remove();
  });
};

export function console(options = {}) {
  compose.run('geth', 'geth attach ipc:/root/.ethereum/$SOLON_ENV/geth.ipc', { cwd: path.join(__dirname, '../') });
};

export function stop(options = {}) {
  compose.down({ cwd: path.join(__dirname, '../') })
};

module.exports = {
  startGeth,
  startConsole,
  stopGeth
};
