import { execSync } from 'child_process';
import { lookup } from 'dns';
import { parse } from 'url';

function getProxy(): string {
  if (process.env.https_proxy) {
    return process.env.https_proxy;
  }
  try {
    return execSync('npm config get https-proxy')
      .toString()
      .trim();
  } catch (e) {
    return '';
  }
}

export function checkIfOnline(isYarn: boolean): Promise<boolean> {
  if (!isYarn) {
    return Promise.resolve(true);
  }

  return new Promise(resolve => {
    lookup('registry.yarnpkg.com', err => {
      let proxy: string;
      if (err != null && (proxy = getProxy())) {
        const hostname = parse(proxy).hostname || '';
        return lookup(hostname, (proxyErr: NodeJS.ErrnoException) => {
          resolve(proxyErr == null);
        });
      }

      resolve(err == null);
    });
  });
}

export function isYarnAvailable(): boolean {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
