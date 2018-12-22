import * as spawn from 'cross-spawn'
import * as path from 'path'

import { Web } from './web'

const angularCliPath = path.resolve(process.cwd(), 'node_modules', '.bin', 'ng')

export class Angular extends Web {
  start = () => {
    this.signale.await('Starting angular...')
    this.child = spawn('node', [angularCliPath, 'serve', '-o'], {
      stdio: 'pipe'
    })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)
  }

  build = () => {
    this.signale.await('Building angular...')
    this.child = spawn('node', [angularCliPath, 'build'], { stdio: 'pipe' })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)

    return new Promise<void>(resolve => {
      this.child.on('exit', () => {
        resolve()
      })
    })
  }
}
