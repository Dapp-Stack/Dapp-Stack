import { IWebFrameworkStrategy, IWebDeployStrategy } from './types';

export class Null implements IWebFrameworkStrategy, IWebDeployStrategy {
  start = () => {};

  build = () => {
    return new Promise<void>(resolve => resolve());
  };

  eject = () => {};

  test = () => {};

  stop = () => {};

  deploy = () => {
    return new Promise<void>(resolve => resolve());
  };
}
