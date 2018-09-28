process.on('unhandledRejection', err => {
  throw err;
});

import * as program from 'commander';

import * as secrets from './index';

program
  .command('setup')
  .action(() => {
    secrets.setup();
  });

program
  .command('show')
  .action(() => {
    secrets.show();
  });

program
  .command('edit')
  .action(() => {
    secrets.edit();
  });

program.parse(process.argv);
