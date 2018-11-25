import * as ejs from 'ejs'
import * as spawn from 'cross-spawn'
import * as fs from 'fs-extra'
import { EOL } from 'os'
import * as path from 'path'
import { Signale } from 'signale'

const log = console.log

function mute () {
  // tslint:disable-next-line: no-unused-expression
  console.log = function () { undefined }
}

function unmute () {
  console.log = log
}

function installDependencies (isYarn: boolean) {
  let command
  let args: string[]

  if (isYarn) {
    command = 'yarnpkg'
    args = ['add']
  } else {
    command = 'npm'
    args = ['install', '--save']
  }

  args.push('@dapp-stack/scripts', '@dapp-stack/test', '@dapp-stack/secrets', 'solium')

  const proc = spawn.sync(command, args, { stdio: 'ignore' })
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`)
    process.exit(1)
  }
}

function updatePackage (appPath: string) {
  const appPackage = require(path.join(appPath, 'package.json'))
  appPackage.dependencies = appPackage.dependencies || {}

  appPackage.scripts = {
    das: 'dapp-stack-scripts',
    secrest: 'dapp-stack-secrets'
  }

  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + EOL)
}

function installTemplate (appPath: string) {
  const templatePath = path.join(__dirname, '..', '..', 'template')
  fs.copySync(templatePath, appPath)

  const filename = path.join(appPath, 'environments', 'local.js.ejs')
  const local = fs.readFileSync(filename, 'utf-8')
  const compiled = ejs.render(local, { webFramework: 'react' })
  fs.writeFileSync(path.join(appPath, 'environments', 'local.js'), compiled)
  fs.unlinkSync(filename)
}

function initReactScripts (
  appPath: string,
  appName: string,
  verbose: boolean,
  originalDirectory: string,
  template: string
) {
  const reactScripts = new Signale({ interactive: true, scope: 'React Scripts' })
  reactScripts.await('[%d/2] - Installing react scripts...', 1)
  const scriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'init.js')
  const init = require(scriptsPath)
  mute()
  init(appPath, appName, verbose, originalDirectory, template)
  unmute()
  reactScripts.success('[%d/2] - Success', 2)
}

function initDappScripts (appPath: string) {
  const dappScripts = new Signale({ interactive: true, scope: 'Dapp Scripts' })
  dappScripts.await('[%d/2] - Installing dapp stack...', 1)

  const isYarn = fs.existsSync(path.join(appPath, 'yarn.lock'))
  installDependencies(isYarn)
  updatePackage(appPath)
  installTemplate(appPath)
  dappScripts.success('[%d/2] - Success', 2)
}

function init (appPath: string, appName: string, verbose: boolean, originalDirectory: string, template: string) {
  initReactScripts(appPath, appName, verbose, originalDirectory, template)
  initDappScripts(appPath)
}

module.exports = init
