import chalk from 'chalk';
import { execSync } from 'child_process';
import { gte } from 'semver';

interface NpmInfo {
  hasMinNpm: boolean;
  npmVersion: string;
}

function checkNpmVersion(): NpmInfo {
  const npmVersion: string = execSync('npm --version')
    .toString()
    .trim();
  const hasMinNpm: boolean = gte(npmVersion, '3.0.0');
  return { hasMinNpm, npmVersion };
}

export default function guardNpmVersion(isYarn: boolean): void {
  if (isYarn) {
    return;
  }
  const npmInfo = checkNpmVersion();
  if (!npmInfo.hasMinNpm) {
    console.log(
      chalk.yellow(
        `You are using npm ${
          npmInfo.npmVersion
        } so the project will be boostrapped with an old unsupported version of tools.\n\n` +
          `Please update to npm 3 or higher for a better, fully supported experience.\n`,
      ),
    );
    process.exit(1);
  }
}
