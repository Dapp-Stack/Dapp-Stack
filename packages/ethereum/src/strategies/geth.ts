import { Ethereum } from '@dapp-stack/environment'
import { ChildProcess } from 'child_process'
import * as spawn from 'cross-spawn'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'

import { IEthereumStrategy } from '../types'

let child: ChildProcess

export class Geth implements IEthereumStrategy {
  private readonly config: Ethereum
  private readonly signale: Signale
  private readonly binaryPath: string
  private readonly dataDir: string
  private readonly ipcFile: string
  private readonly logStream: fs.WriteStream

  constructor(config: Ethereum, signale: Signale) {
    this.config = config
    this.signale = signale
    this.binaryPath = path.resolve(__dirname, '..', '..', '..', 'bin', 'geth')
    this.dataDir = path.join(process.cwd(), '.geth')
    this.ipcFile = path.join(this.dataDir, 'geth.ipc')
    fs.ensureDirSync(this.dataDir)
    fs.ensureDirSync(path.join(process.cwd(), 'logs'))
    this.logStream = fs.createWriteStream(
      path.join(process.cwd(), 'logs', 'geth.log')
    )
  }

  start = () => {
    if (fs.existsSync(this.ipcFile)) {
      this.signale.success('Connected to geth')
      return new Promise<boolean>(resolve => resolve(true))
    }

    return this.startDaemon()
  }

  startDaemon = () => {
    this.signale.await('Starting geth...')
    return new Promise<boolean>(async resolve => {
      this.init()
      await this.daemon()
      this.signale.success('Geth is running')
      resolve(true)
    })
  }

  stop = () => {
    return new Promise<boolean>(resolve => {
      child && child.kill()
      resolve(true)
    })
  }

  console = () => {
    let attachTo: string = ''
    switch (this.config.network) {
      case 'dev':
        attachTo = this.ipcFile
        break
      case 'external':
        attachTo = 'http://127.0.0.1:8545'
        break
      default:
        attachTo = `https://${this.config.network}.infura.io/${this.config
          .apiKey || ''}`
    }

    spawn.sync(this.binaryPath, ['attach', attachTo], {
      stdio: [process.stdin, process.stdout, process.stderr]
    })
  }

  private readonly command = (): string[] => {
    return [
      '--dev',
      '--datadir',
      this.dataDir,
      '--ws',
      '--wsaddr',
      '0.0.0.0',
      '--wsorigins',
      '*',
      '--wsport',
      '8546',
      '--rpc',
      '--rpcapi',
      'db,personal,eth,net,web3,ssh,debug',
      '--rpcaddr',
      '0.0.0.0',
      '--rpcport',
      '8545',
      '--rpccorsdomain',
      '*',
      '--nodiscover'
    ]
  }

  private readonly init = () => {
    spawn.sync(this.binaryPath, this.command().concat('init'))
  }

  private readonly daemon = () => {
    child = spawn(this.binaryPath, this.command(), { stdio: 'pipe' })
    child.stdout.pipe(this.logStream)
    child.stderr.pipe(this.logStream)

    return new Promise<void>(resolve => {
      let ipcOpened = false
      let httpOpened = false
      let websocketOpened = false

      child.stderr.on('data', (data: Buffer) => {
        if (data.toString().includes('IPC endpoint opened')) {
          ipcOpened = true
        }

        if (data.toString().includes('HTTP endpoint opened')) {
          httpOpened = true
        }

        if (data.toString().includes('WebSocket endpoint opened')) {
          websocketOpened = true
        }

        if (ipcOpened && httpOpened && websocketOpened) {
          resolve()
        }
      })
    })
  }
}
