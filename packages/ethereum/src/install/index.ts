import { download } from './download'

const error = (error: Error) => {
  process.stdout.write(`${error}\n`)
  process.stdout.write('Download failed!\n\n')
  process.exit(1)
}

const success = (output: { filename: string; installPath: string }) => {
  process.stdout.write(`Downloaded ${output.filename}\n`)
  process.stdout.write(`Installed geth to ${output.installPath}\n`)
  process.exit(0)
}

download()
  .then(success)
  .catch(error)
