import { execSync } from 'child_process';
import { lookup } from 'dns';

function getProxy(): string {
  if (process.env.https_proxy) {
    return process.env.https_proxy;
  } else {
    try {
      let httpsProxy = execSync('npm config get https-proxy')
        .toString()
        .trim();
      return httpsProxy !== 'null' ? httpsProxy : undefined;
    } catch (e) {
      return '';
    }
  }
}

export function checkIfOnline(useYarn: boolean): Promise<boolean> {
  if (!useYarn) {
    return Promise.resolve(true);
  }

  return new Promise(resolve => {
    lookup('registry.yarnpkg.com', err => {
      let proxy;
      if (err != null && (proxy = getProxy())) {
        lookup(url.parse(proxy).hostname, proxyErr => {
          resolve(proxyErr == null);
        });
      } else {
        resolve(err == null);
      }
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