import * as ejs from 'ejs';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Signale } from 'signale';
import { EOL } from 'os';

const signale = new Signale({ scope: 'CLI' });

signale.await(`Generating app into ${process.cwd()}`);
const base = path.join(__dirname, '..', '..', 'template');

const contractsDest = path.join(process.cwd(), 'contracts');
const environmentsDest = path.join(process.cwd(), 'environments');
const soliumignoreDest = path.join(process.cwd(), '.soliumignore');
const soliumrcDest = path.join(process.cwd(), '.soliumrc.json');
const packageDest = path.join(process.cwd(), 'package.json');
const readmeDest = path.join(process.cwd(), 'README.md');
const gitignoreDest = path.join(process.cwd(), '.gitignore');

if (
  fs.existsSync(contractsDest) ||
  fs.existsSync(environmentsDest) ||
  fs.existsSync(soliumignoreDest) ||
  fs.existsSync(soliumrcDest) ||
  fs.existsSync(packageDest) ||
  fs.existsSync(readmeDest) ||
  fs.existsSync(gitignoreDest)
) {
  signale.error(
    'One of the destination file/folder already exists, it is better to start from an empty directory to avoid conflict.',
  );
  process.exit(1);
}

fs.copySync(path.join(base, 'contracts'), contractsDest);
fs.copySync(path.join(base, 'environments'), environmentsDest);
fs.copySync(path.join(base, '.soliumignore'), soliumignoreDest);
fs.copySync(path.join(base, 'README.md'), readmeDest);
fs.copySync(path.join(base, 'gitignore'), gitignoreDest);

const filename = path.join(environmentsDest, 'local.js.ejs');
const local = fs.readFileSync(filename, 'utf-8');
const compiled = ejs.render(local, { webFramework: false });
fs.writeFileSync(path.join(environmentsDest, 'local.js'), compiled);
fs.unlinkSync(filename);

const packageData = {
  name: path.basename(process.cwd()),
  version: '0.1.0',
  scripts: {
    das: 'dapp-stack-scripts',
  },
  dependencies: {
    '@dapp-stack/scripts': '0.1.0',
    '@dapp-stack/test': '0.1.0',
    solium: '^1.1.8',
  },
};
fs.writeFileSync(packageDest, JSON.stringify(packageData, null, 2) + EOL);

signale.success('Congratulations, your Dapp has been generated.');
signale.success('First, install the dependencies using npm install or yarn install');
signale.success('');
signale.success('Then if you use yarn you can use the following commands:');
signale.success('     yarn das start    Start the Dapp in development mode');
signale.success('     yarn das build    Build the Dapp');
signale.success('');
signale.success('If you use npm you can use the following commands:');
signale.success('     npm run das start    Start Dapp in development mode');
signale.success('     npm run das build    Build the Dapp');
signale.success('');
signale.success('You can also find more commands and documentation at https://github.com/Dapp-Stack/Dapp-Stack');
