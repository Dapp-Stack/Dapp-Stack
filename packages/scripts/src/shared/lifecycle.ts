import * as ethereum from '@dapp-stack/ethereum'
import * as ipfs from '@dapp-stack/ipfs'
import * as web from '@dapp-stack/web'
import * as test from '@dapp-stack/test'

export async function stopAsync(
  { shouldExit }: { shouldExit: boolean } = { shouldExit: false }
) {
  await ethereum.stop()
  await ipfs.stop()
  web.stop()

  if (shouldExit) {
    process.exit()
  }
}

export function after() {
  process.stdin.resume()

  process.on('SIGTERM', stopAsync.bind(null, { shouldExit: true }))
  process.on('SIGINT', stopAsync.bind(null, { shouldExit: true }))
  process.on('SIGUSR1', stopAsync.bind(null, { shouldExit: true }))
  process.on('SIGUSR2', stopAsync.bind(null))
  process.on('uncaughtException', error => {
    console.log(error.stack)
    stopAsync.bind(null, { shouldExit: true })()
  })
}
