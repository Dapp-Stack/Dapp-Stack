import * as spawn from 'cross-spawn'
import * as path from 'path'

import { Web } from './web'

const vueCliPath = path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  'vue-cli-service'
)

export class Vue extends Web {
  start = () => {
    this.signale.await('Starting vue.js...')
    this.child = spawn('node', [vueCliPath, 'serve'], {
      stdio: 'pipe'
    })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)
  }

  build = () => {
    this.signale.await('Building vue.js...')
    this.child = spawn('node', [vueCliPath, 'build'], { stdio: 'pipe' })
    this.child.stderr.on('data', this.onStderr)
    this.child.stdout.on('data', this.onStdout)

    return new Promise<void>(resolve => {
      this.child.on('exit', () => {
        resolve()
      })
    })
  }
}
