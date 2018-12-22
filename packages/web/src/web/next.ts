import * as spawn from 'cross-spawn'
import * as path from 'path'

import { Web } from './web'

const nextCliPath = path.resolve(process.cwd(), 'node_modules', '.bin', 'next')

export class Next extends Web {
  start = () => {
    this.signale.await('Starting next...')
    this.child = spawn('node', [nextCliPath], {
      stdio: 'pipe'
    })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)
  }

  build = () => {
    this.signale.await('Building next...')
    this.child = spawn('node', [nextCliPath, 'build'], { stdio: 'pipe' })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)

    return new Promise<void>(resolve => {
      this.child.on('exit', () => {
        resolve()
      })
    })
  }
}
