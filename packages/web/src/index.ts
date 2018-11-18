import { build as buildEnv } from '@solon/environment';
import { Signale } from 'signale';

import { IWebFrameworkStrategy, IWebDeployStrategy } from './types';
import { Null } from './null';
import { React } from './strategies/react';
import { Ipfs } from './strategies/ipfs';

const signale = new Signale({ scope: 'Web' });

const frameworkStrategy = (): IWebFrameworkStrategy => {
  const framework = buildEnv().web.framework;
  if (!framework) return new Null();

  switch (framework) {
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

const deployStrategy = (): IWebDeployStrategy => {
  const deploy = buildEnv().web.deploy;
  if (!deploy) return new Null();

  switch (deploy) {
    case 'ipfs':
      return new Ipfs(signale);
  }
};

export const start = () => {
  frameworkStrategy().start();
};

export const build = () => {
  return frameworkStrategy().build();
};

export const test = () => {
  frameworkStrategy().test();
};

export const eject = () => {
  frameworkStrategy().eject();
};

export const stop = () => {
  frameworkStrategy().stop();
};

export const deploy = () => {
  return deployStrategy().deploy();
};
