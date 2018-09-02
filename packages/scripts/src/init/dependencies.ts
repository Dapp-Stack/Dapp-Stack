import * as spawn from 'cross-spawn';

export function installDependencies(useYarn: boolean, verbose: boolean) {
  let command;
  let args: string[];

  if (useYarn) {
    command = 'yarnpkg';
    args = ['add'];
  } else {
    command = 'npm';
    args = ['install', '--save'];
    if(verbose) {
      args.push('--verbose')
    }
  }
  
  args.push('react', 'react-dom', 'web3', 'solium');

  console.log(`Installing react and react-dom using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(1);
  }
}
