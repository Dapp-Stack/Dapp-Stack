import * as program from 'commander'

import * as secrets from './index'

program
  .command('setup')
  .description('Generate the masket key and the encrypted secrets')
  .action(() => {
    secrets.setup()
  })

program
  .command('show')
  .description('Display the secrets')
  .action(() => {
    secrets.show()
  })

program
  .command('edit')
  .description('Edit the secrets')
  .action(() => {
    secrets
      .edit()
      .then()
      .catch()
  })

program.parse(process.argv)

const showHelp = program.args.length === 0
if (showHelp) {
  program.help()
}
