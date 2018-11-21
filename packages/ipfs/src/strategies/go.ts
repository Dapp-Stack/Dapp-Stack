import { ChildProcess } from 'child_process'
import * as spawn from 'cross-spawn'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'

import { IIpfsStrategy } from '../types'

let child: ChildProcess

export class Go implements IIpfsStrategy {
  private readonly signale: Signale
  private readonly binaryPath: string
  private readonly logStream: fs.WriteStream

  constructor (signale: Signale) {
    this.signale = signale
    this.binaryPath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '.bin', 'ipfs')

    fs.ensureDirSync(path.join(process.cwd(), 'logs'))
    this.logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'ipfs.log'))
  }

  start = () => {
    this.signale.await('Starting ipfs...')
    return new Promise<boolean>(resolve => {
      this.init()
      this.updateCorsConfig()
      this.daemon()
      this.signale.success('Ipfs is running')
      resolve(true)
    })
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      child && child.kill()
      resolve(true)
    })
  }

  private readonly init = () => {
    spawn.sync(this.binaryPath, ['init'])
  }

  private readonly updateCorsConfig = () => {
    [
      ['--json', 'API.HTTPHeaders.Access-Control-Allow-Origin', '["http://localhost:3000"]'],
      ['--json', 'API.HTTPHeaders.Access-Control-Allow-Methods', '["GET", "POST"]'],
      ['--json', 'API.HTTPHeaders.Access-Control-Allow-Headers', '["Authorization"]'],
      ['--json', 'API.HTTPHeaders.Access-Control-Expose-Headers', '["Location"]'],
      ['--json', 'API.HTTPHeaders.Access-Control-Allow-Credentials', '["true"]']
    ].forEach(command => {
      spawn.sync(this.binaryPath, ['config'].concat(command))
    })
  }

  private readonly daemon = () => {
    child = spawn(this.binaryPath, ['daemon'], { stdio: 'pipe' })
    child.stdout.pipe(this.logStream)
    child.stderr.pipe(this.logStream)
  }
}
