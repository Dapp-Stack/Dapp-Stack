if (!useYarn) {
  const npmInfo = checkNpmVersion();
  if (!npmInfo.hasMinNpm) {
    if (npmInfo.npmVersion) {
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
}

function checkNpmVersion() {
  let hasMinNpm = false;
  let npmVersion = null;
  try {
    npmVersion = execSync('npm --version')
      .toString()
      .trim();
    hasMinNpm = semver.gte(npmVersion, '3.0.0');
  } catch (err) {
    // ignore
  }
  return {
    hasMinNpm: hasMinNpm,
    npmVersion: npmVersion,
  };
}
