import chalk from 'chalk';
import { createReadStream, ReadStream } from 'fs-extra';
import hyperquest from 'hyperquest';
import { join, resolve } from 'path';
import { valid } from 'semver';
import tarPack from 'tar-pack';
import { dir } from 'tmp';

interface TemporaryDirectory {
  tmpdir: string;
  cleanup(): void;
}

export function getSolonScriptsToInstall(version: string, originalDirectory: string): string {
  console.log(version)
  let packageToInstall = '@solon/scripts';
  const validSemver = valid(version);
  if (validSemver) {
    packageToInstall += `@${validSemver}`;
  } else if (version) {
    const matcher = version.match(/^file:(.*)?$/);
    console.log(matcher)
    if (version[0] === '@' && version.indexOf('/') === -1) {
      packageToInstall += version;
    } else if (matcher && matcher[1]) {
      packageToInstall = `file:${resolve(originalDirectory, matcher[1])}`;
    } else {
      packageToInstall = version;
    }
  }
  return packageToInstall;
}

export function getSolonScriptsPackageName(installPackage: string): Promise<string> {
  const matches = installPackage.match(/^.+\/(.+?)(?:-\d+.+)?\.(tgz|tar\.gz)$/);
  if (matches) {
    return getTemporaryDirectory()
      .then(obj => {
        let stream: ReadStream;
        if (/^http/.test(installPackage)) {
          stream = hyperquest(installPackage);
        } else {
          stream = createReadStream(installPackage);
        }
        return extractStream(stream, obj.tmpdir).then(() => obj);
      })
      .then(obj => {
        const packageName = require(join(obj.tmpdir, 'package.json')).name;
        obj.cleanup();
        return packageName;
      })
      .catch(err => {
        console.log(`Could not extract the package name from the archive: ${err.message}`);
        const assumedProjectName = (matches && matches[1]) || '';
        console.log(`Based on the filename, assuming it is "${chalk.cyan(assumedProjectName)}"`);
        return Promise.resolve(assumedProjectName);
      });
  }

  if (installPackage.indexOf('git+') === 0) {
    const matches = installPackage.match(/([^/]+)\.git(#.*)?$/);
    const assumedProjectName = (matches && matches[1]) || '';
    return Promise.resolve(assumedProjectName);
  }

  if (installPackage.match(/.+@/)) {
    return Promise.resolve(installPackage.charAt(0) + installPackage.substr(1).split('@')[0]);
  }

  if (installPackage.match(/^file:/)) {
    const matches = installPackage.match(/^file:(.*)?$/);
    const installPackagePath = (matches && matches[1]) || '';
    const installPackageJson = require(join(installPackagePath, 'package.json'));
    return Promise.resolve(installPackageJson.name);
  }

  return Promise.resolve(installPackage);
}

function extractStream(stream: ReadStream, dest: string): Promise<string> {
  return new Promise((resolve, reject) => {
    stream.pipe(
      tarPack(dest, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(dest);
        }
      }),
    );
  });
}

function getTemporaryDirectory(): Promise<TemporaryDirectory> {
  return new Promise((resolve, reject) => {
    dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          tmpdir,
          cleanup: () => {
            try {
              callback();
            } catch {}
          },
        });
      }
    });
  });
}
