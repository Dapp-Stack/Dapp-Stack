import spawn from 'cross-spawn';
import chalk from 'chalk';

export default function guardNpm(useYarn: boolean): void {
  if (useYarn) {
    return;
  }
  const cwd = process.cwd();
  let childOutput = null;
  try {
    childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
  } catch (err) {
    return;
  }
  if (typeof childOutput !== 'string') {
    return;
  }
  const lines = childOutput.split('\n');
  
  const prefix = '; cwd = ';
  const line = lines.find(line => line.indexOf(prefix) === 0);
  if (typeof line !== 'string') {
    return;
  }
  const npmCWD = line.substring(prefix.length);
  if (npmCWD === cwd) {
    return;
  }
  console.error(
    chalk.red(
      `Could not start an npm process in the right directory.\n\n` +
      `The current directory is: ${chalk.bold(cwd)}\n` +
      `However, a newly started npm process runs in: ${chalk.bold(
        npmCWD
      )}\n\n` +
      `This is probably caused by a misconfigured system terminal shell.`
    )
  );
  if (process.platform === 'win32') {
    console.error(
      chalk.red(`On Windows, this can usually be fixed by running:\n\n`) +
      `  ${chalk.cyan(
        'reg'
      )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
      `  ${chalk.cyan(
        'reg'
      )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
      chalk.red(`Try to run the above two lines in the terminal.\n`) +
      chalk.red(
        `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
      )
    );
  }
  process.exit(1);
}