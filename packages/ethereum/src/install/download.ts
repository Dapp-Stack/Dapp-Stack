import * as fs from 'fs-extra'
import * as goenv from 'go-platform'
import * as gunzip from 'gunzip-maybe'
import * as path from 'path'
import * as request from 'request'
import * as tarFS from 'tar-fs'

const VERSION = '1.8.21-9dc5d1a9'

type DownloadResult = { filename: string; installPath: string }

export const download = (): Promise<DownloadResult> => {
  return new Promise<DownloadResult>((resolve, reject) => {
    const platform: string = goenv.GOOS
    const arch: string = goenv.GOARCH
    const installPath = path.join(__dirname, '..', 'bin')
    const isWindows: boolean = platform === 'windows'
    fs.ensureDirSync(installPath)

    const extension = isWindows ? '.exe' : '.tar.gz'
    const folder = `geth-${platform}-${arch}-${VERSION}`
    const filename = `${folder}${extension}`
    const url = `https://gethstore.blob.core.windows.net/builds/${filename}`
    const isEmpty = fs.readdirSync(installPath).length === 0
    const done = () => resolve({ filename, installPath })

    if (!isEmpty) {
      return new Promise(resolve => done())
    }

    const unpack = (stream: request.Response) => {
      return stream.pipe(gunzip()).pipe(
        tarFS.extract(installPath).on('finish', () => {
          fs.moveSync(
            path.join(installPath, folder, 'geth'),
            path.join(installPath, 'geth'),
            { overwrite: true }
          )
          done()
        })
      )
    }

    process.stdout.write(`Downloading ${url}\n`)

    return request
      .get(url, (error, response, body) => {
        if (error) {
          return reject(error)
        }

        if (response.statusCode !== 200) {
          reject(new Error(`${response.statusCode} - ${response.body}`))
        }
      })
      .on('response', response => {
        if (response.statusCode !== 200) {
          return
        }

        if (isWindows) {
          fs.moveSync(
            path.join(installPath, filename),
            path.join(installPath, 'geth.exe'),
            { overwrite: true }
          )
          return done()
        }
        unpack(response)
      })
  })
}
