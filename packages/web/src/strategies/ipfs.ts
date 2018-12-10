import * as spawn from 'cross-spawn'
import * as path from 'path'
import { Signale } from 'signale'
import { Structure } from '@dapp-stack/environment'
import { IWebDeployStrategy } from '../types'

const opn = require('opn')

const ipfsPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'node_modules',
  '.bin',
  'ipfs'
)

export class Ipfs implements IWebDeployStrategy {
  private readonly signale: Signale

  constructor(signale: Signale) {
    this.signale = signale
  }

  deploy = () => {
    this.signale.await('Deploying assets to IPFS...')
    const child = spawn(ipfsPath, ['add', '-r', Structure.assets], {
      stdio: 'pipe'
    })
    let rootHash = ''

    child.stdout.on('data', (data: Buffer) => {
      const lines = data
        .toString('utf-8')
        .trim()
        .split('\n')
      const lastLine = lines[lines.length - 1]
      rootHash = lastLine.split(' ')[1]
      lines.forEach(line => this.signale.info(line))
    })

    return new Promise<void>(resolve => {
      child.on('exit', () => {
        spawn.sync(
          ipfsPath,
          [
            'files',
            'cp',
            `/ipfs/${rootHash}`,
            `/assets-${new Date().getTime()}`
          ],
          {
            stdio: 'inherit'
          }
        )
        const url = `http://localhost:8080/ipfs/${rootHash}`
        opn(url)
        setTimeout(() => {
          this.signale.success(`Deployment finished with success.`)
          resolve()
        }, 3000)
      })
    })
  }
}
