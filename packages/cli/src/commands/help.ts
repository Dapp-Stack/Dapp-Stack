import chalk from 'chalk';

export default function help(): void {
  console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
  console.log();
  console.log(`    A custom ${chalk.cyan('--scripts-version')} can be one of:`);
  console.log(`      - a specific npm version: ${chalk.green('0.1.0')}`);
  console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
  console.log(`      - a custom fork published on npm: ${chalk.green('my-solon-scripts')}`);
  console.log(
    `      - a local path relative to the current working directory: ${chalk.green('file:../my-solon-scripts')}`,
  );
  console.log(`      - a .tgz archive: ${chalk.green('https://mysite.com/my-solon-scripts-0.1.0.tgz')}`);
  console.log(`      - a .tar.gz archive: ${chalk.green('https://mysite.com/my-solon-scripts-0.1.0.tar.gz')}`);
  console.log(`    It is not needed unless you specifically want to use a fork.`);
  console.log();
  console.log(`    If you have any problems, do not hesitate to file an issue:`);
  console.log(`      ${chalk.cyan('https://github.com/SolonProject/solon/issues/new')}`);
  console.log();
}
