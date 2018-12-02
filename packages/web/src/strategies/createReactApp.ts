import * as child_process from 'child_process'
import * as spawn from 'cross-spawn'
import * as path from 'path'
import { Signale } from 'signale'

import { IWebFrameworkStrategy } from '../types'

const reactScriptsPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'node_modules',
  '.bin',
  'react-scripts'
)

export class CreateReactApp implements IWebFrameworkStrategy {
  private readonly signale: Signale
  private child!: child_process.ChildProcess

  constructor(signale: Signale) {
    this.signale = signale
  }

  start = () => {
    this.signale.await('Starting react-scripts...')
    this.child = spawn('node', [reactScriptsPath, 'start'], { stdio: 'pipe' })
    this.child.stderr.on('data', (data: Buffer) => {
      data
        .toString('utf-8')
        .trim()
        .split('\n')
        .forEach(line => this.signale.error(line))
    })
    this.child.stdout.on('data', (data: Buffer) => {
      data
        .toString('utf-8')
        .trim()
        .split('\n')
        .forEach(line => this.signale.info(line))
    })
  }

  build = () => {
    this.signale.await('Building react-scripts...')
    this.child = spawn('node', [reactScriptsPath, 'build'], { stdio: 'pipe' })
    this.child.stderr.on('data', (data: Buffer) => {
      data
        .toString('utf-8')
        .trim()
        .split('\n')
        .forEach(line => this.signale.error(line))
    })
    this.child.stdout.on('data', (data: Buffer) => {
      data
        .toString('utf-8')
        .trim()
        .split('\n')
        .forEach(line => this.signale.info(line))
    })

    return new Promise<void>(resolve => {
      this.child.on('exit', () => {
        resolve()
      })
    })
  }

  stop = () => {
    this.child && this.child.kill()
  }
}
