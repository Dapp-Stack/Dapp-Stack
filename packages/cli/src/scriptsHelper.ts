import semver from 'semver';
import hyperquest from 'hyperquest';
import fs from 'fs-extra';
import path from 'path';
import unpack from 'tar-pack';
import tmp from 'tmp';

export function getSolonScriptsToInstall(version: string, originalDirectory: string): string {
  let packageToInstall = '@solon/scripts';
  const validSemver = semver.valid(version);
  if (validSemver) {
    packageToInstall += `@${validSemver}`;
  } else if (version) {
    if (version[0] === '@' && version.indexOf('/') === -1) {
      packageToInstall += version;
    } else if (version.match(/^file:/)) {
      packageToInstall = `file:${path.resolve(
        originalDirectory,
        version.match(/^file:(.*)?$/)[1]
      )}`;
    } else {
      packageToInstall = version;
    }
  }
  return packageToInstall;
}

export function getSolonScriptsPackageName(installPackage: string) {
  if (installPackage.match(/^.+\.(tgz|tar\.gz)$/)) {
    return getTemporaryDirectory()
      .then(obj => {
        let stream;
        if (/^http/.test(installPackage)) {
          stream = hyperquest(installPackage);
        } else {
          stream = fs.createReadStream(installPackage);
        }
        return extractStream(stream, obj.tmpdir).then(() => obj);
      })
      .then(obj => {
        const packageName = require(path.join(obj.tmpdir, 'package.json')).name;
        obj.cleanup();
        return packageName;
      })
      .catch(err => {
        // The package name could be with or without semver version, e.g. react-scripts-0.2.0-alpha.1.tgz
        // However, this function returns package name only without semver version.
        console.log(
          `Could not extract the package name from the archive: ${err.message}`
        );
        const assumedProjectName = installPackage.match(
          /^.+\/(.+?)(?:-\d+.+)?\.(tgz|tar\.gz)$/
        )[1];
        console.log(
          `Based on the filename, assuming it is "${chalk.cyan(
            assumedProjectName
          )}"`
        );
        return Promise.resolve(assumedProjectName);
      });
  } else if (installPackage.indexOf('git+') === 0) {
    // Pull package name out of git urls e.g:
    // git+https://github.com/mycompany/react-scripts.git
    // git+ssh://github.com/mycompany/react-scripts.git#v1.2.3
    return Promise.resolve(installPackage.match(/([^/]+)\.git(#.*)?$/)[1]);
  } else if (installPackage.match(/.+@/)) {
    // Do not match @scope/ when stripping off @version or @tag
    return Promise.resolve(
      installPackage.charAt(0) + installPackage.substr(1).split('@')[0]
    );
  } else if (installPackage.match(/^file:/)) {
    const installPackagePath = installPackage.match(/^file:(.*)?$/)[1];
    const installPackageJson = require(path.join(
      installPackagePath,
      'package.json'
    ));
    return Promise.resolve(installPackageJson.name);
  }
  return Promise.resolve(installPackage);
}

function extractStream(stream, dest) {
  return new Promise((resolve, reject) => {
    stream.pipe(
      unpack(dest, err => {
        if (err) {
          reject(err);
        } else {
          resolve(dest);
        }
      })
    );
  });
}

function getTemporaryDirectory() {
  return new Promise((resolve, reject) => {
    // Unsafe cleanup lets us recursively delete the directory if it contains
    // contents; by default it only allows removal if it's empty
    tmp.dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          tmpdir: tmpdir,
          cleanup: () => {
            try {
              callback();
            } catch (ignored) {
              // Callback might throw and fail, since it's a temp directory the
              // OS will clean it up eventually...
            }
          },
        });
      }
    });
  });
}