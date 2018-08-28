const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

const errorLogFilePatterns: string[] = [
  'npm-debug.log',
  'yarn-error.log',
  'yarn-debug.log',
];

const validFiles: string[] = [
  '.DS_Store',
  'Thumbs.db',
  '.git',
  '.gitignore',
  '.idea',
  'README.md',
  'LICENSE',
  'web.iml',
  '.hg',
  '.hgignore',
  '.hgcheck',
  '.npmignore',
  'mkdocs.yml',
  'docs',
  '.travis.yml',
  '.gitlab-ci.yml',
  '.gitattributes',
];

export default function guardDir(root: string, name: string) {
  console.log();

  const conflicts: string[] = fs
    .readdirSync(root)
    .filter((file: string) => !validFiles.includes(file))
    .filter((file: string) => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0));

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      console.log(`  ${file}`);
    }
    console.log();
    console.log(
      'Either try using a new directory name, or remove the files listed above.'
    );

    process.exit(1);
  }

  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach((file: string) => {
    errorLogFilePatterns.forEach(errorLogFilePattern => {
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(root, file));
      }
    });
  });
}