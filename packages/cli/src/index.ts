import * as ejs from 'ejs'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'
import { EOL } from 'os'

const signale = new Signale({ scope: 'CLI' })

signale.await(`Generating app into ${process.cwd()}`)
const base = path.join(__dirname, '..', '..', 'template')

const contractsDest = path.join(process.cwd(), 'contracts')
const environmentsDest = path.join(process.cwd(), 'environments')
const soliumignoreDest = path.join(process.cwd(), '.soliumignore')
const soliumrcDest = path.join(process.cwd(), '.soliumrc.json')
const packageDest = path.join(process.cwd(), 'package.json')
const readmeDest = path.join(process.cwd(), 'README.md')
const gitignoreDest = path.join(process.cwd(), '.gitignore')
const createReactAppIndex = path.join(process.cwd(), 'public', 'index.html')

if (
  fs.existsSync(contractsDest) ||
  fs.existsSync(environmentsDest) ||
  fs.existsSync(soliumignoreDest) ||
  fs.existsSync(soliumrcDest)
) {
  signale.error(
    'One of the destination file/folder already exists, it is better to start from an empty directory to avoid conflict.'
  )
  process.exit(1)
}

fs.copySync(path.join(base, 'contracts'), contractsDest)
fs.copySync(path.join(base, 'environments'), environmentsDest)
fs.copySync(path.join(base, '.soliumignore'), soliumignoreDest)

const filename = path.join(environmentsDest, 'local.js.ejs')
const local = fs.readFileSync(filename, 'utf-8')
const compiled = ejs.render(local, { webFramework: false })
fs.writeFileSync(path.join(environmentsDest, 'local.js'), compiled)
fs.unlinkSync(filename)

let packageData
if (fs.existsSync(packageDest)) {
  packageData = fs.readJSONSync(packageDest)
  packageData.scripts = packageData.scripts || {}

  packageData.scripts.das = 'dapp-stack-scripts'
  packageData.scripts.secrets = 'dapp-stack-secrets'

  packageData.devDependencies = packageData.devDependencies || {}
  packageData.devDependencies['@dapp-stack/scripts'] = '^0.1.0'
  packageData.devDependencies['@dapp-stack/test'] = '^0.1.0'
  packageData.devDependencies['@dapp-stack/secrets'] = '^0.1.0'
  packageData.devDependencies.solium = '^1.1.8'
} else {
  packageData = {
    name: path.basename(process.cwd()),
    version: '0.1.0',
    scripts: {
      das: 'dapp-stack-scripts',
      secrest: 'dapp-stack-secrets'
    },
    devDependencies: {
      '@dapp-stack/scripts': '^0.1.0',
      '@dapp-stack/test': '^0.1.0',
      '@dapp-stack/secrets': '^0.1.0',
      solium: '^1.1.8'
    }
  }
}
fs.writeFileSync(packageDest, JSON.stringify(packageData, null, 2) + EOL)

if (!fs.existsSync(readmeDest)) {
  fs.copySync(path.join(base, 'README.md'), readmeDest)
}

if (fs.existsSync(gitignoreDest)) {
  const data = fs.readFileSync(gitignoreDest)
  fs.appendFileSync(gitignoreDest, data)
} else {
  fs.copySync(path.join(base, 'gitignore'), gitignoreDest)
}

if (fs.existsSync(createReactAppIndex)) {
  fs.copySync(path.join(base, 'create-react-app.html'), createReactAppIndex)
}

signale.success('Congratulations, your Dapp has been generated.')
signale.success(
  'First, install the dependencies using npm install or yarn install'
)
signale.success('')
signale.success('Then if you use yarn you can use the following commands:')
signale.success('     yarn das start    Start the Dapp in development mode')
signale.success('     yarn das build    Build the Dapp')
signale.success('')
signale.success('If you use npm you can use the following commands:')
signale.success('     npm run das start    Start Dapp in development mode')
signale.success('     npm run das build    Build the Dapp')
signale.success('')
signale.success(
  'You can also find more commands and documentation at https://github.com/Dapp-Stack/Dapp-Stack'
)
