import { IWebStrategy } from '../types';

export class Null implements IWebStrategy {
  start = () => { };

  build = () => {
    return new Promise<void>(resolve => resolve());
  };

  eject = () => { };

  test = () => { };

  stop = () => { };
}
