import { Structure } from '@dapp-stack/environment'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'

const gethDir = path.join(process.cwd(), '.geth')
const webDir = path.join(process.cwd(), 'build')
const contractDir = Structure.contracts.build
const securityDir = Structure.contracts.security
const docDir = Structure.contracts.doc

const signale = new Signale({ scope: 'Cleaner' })
signale.await('Cleaner started')
;[gethDir, webDir, contractDir, securityDir, docDir].forEach(dir => {
  if (fs.existsSync(gethDir)) {
    fs.removeSync(dir)
    signale.success(`${dir} directory removed`)
  }
})
