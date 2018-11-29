import * as program from 'commander'

program
  .command('build')
  .description('Generate the masket key and the encrypted secrets')
  .action(() => {
    require('./build')
  })

program
  .command('start')
  .description('Start to developer with auto deploy and watchers')
  .action(() => {
    require('./start')
  })

program
  .command('stop')
  .description('Stop all dapp-stack process, in case there is zombies')
  .action(() => {
    require('./stop')
  })

program
  .command('test')
  .description('Run the contracts tests')
  .action(() => {
    require('./test')
  })

program
  .command('deploy')
  .description('Deploy the contracts and the assets')
  .action(() => {
    require('./deploy')
  })

program
  .command('security')
  .description('Run security check on the contracts (require docker)')
  .action(() => {
    require('./security')
  })

program
  .command('clean')
  .description('Remove all DApp Stack temporary directories')
  .action(() => {
    require('./clean')
  })

program
  .command('console')
  .description('Start a geth console')
  .action(() => {
    require('./console')
  })

program.parse(process.argv)

const showHelp = program.args.length === 0
if (showHelp) {
  program.help()
}
