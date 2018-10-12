import { build as buildEnv } from '@solon/environment';
import { Signale } from 'signale';

import { IWebStrategy} from './types';
import { Null } from './strategies/null';
import { React } from './strategies/react';

const signale = new Signale({ scope: 'Web' });

const strategy = (): IWebStrategy => {
  const web = buildEnv().services.web;
  if (!web) return new Null();

  switch (web) {
    case 'react':
      return new React(signale);
    // case 'vue':
    //   return new Vue(signale);
    // case 'angular':
    //   return new Angular(signale);
    default:
      return new Null();
  }
};

export const start = () => {
  strategy().start();
};

export const build = () => {
  strategy().build();
};

export const test = () => {
  strategy().test();
};

export const eject = () => {
  strategy().eject();
};

export const stop = () => {
  strategy().stop();
};
