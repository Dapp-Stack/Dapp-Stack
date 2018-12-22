import * as spawn from 'cross-spawn'
import * as path from 'path'

import { Web } from './web'

const reactScriptsPath = path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  'react-scripts'
)

export class CreateReactApp extends Web {
  start = () => {
    this.signale.await('Starting react-scripts...')
    this.child = spawn('node', [reactScriptsPath, 'start'], { stdio: 'pipe' })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)
  }

  build = () => {
    this.signale.await('Building react-scripts...')
    this.child = spawn('node', [reactScriptsPath, 'build'], { stdio: 'pipe' })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)

    return new Promise<void>(resolve => {
      this.child.on('exit', () => {
        resolve()
      })
    })
  }
}
