import { execSync } from 'child_process';
import semver from 'semver';

interface NpmInfo {
  hasMinNpm: boolean;
  npmVersion: string
}

function checkNpmVersion(): NpmInfo {
  let npmVersion: string = execSync('npm --version')
    .toString()
    .trim();
  let hasMinNpm: boolean = semver.gte(npmVersion, '3.0.0');
  return {
    hasMinNpm: hasMinNpm,
    npmVersion: npmVersion,
  };
}

export default function guardNpmVersion(useYarn: boolean): void {
  if (useYarn) {
    return;
  }
  const npmInfo = checkNpmVersion();
  if (!npmInfo.hasMinNpm) {
    console.log(
      chalk.yellow(
        `You are using npm ${
          npmInfo.npmVersion
          } so the project will be boostrapped with an old unsupported version of tools.\n\n` +
        `Please update to npm 3 or higher for a better, fully supported experience.\n`
      )
    );
    process.exit(1);
  }
}