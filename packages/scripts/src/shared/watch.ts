import { compile } from '@solon/compiler';
import { deploy } from './deploy';

import { Environment } from '@solon/environment';
import { Signale } from 'signale';

export function watch(environment: Environment): void {
  const compiler = new Signale({ interactive: true, scope: 'Compiler' });
}
