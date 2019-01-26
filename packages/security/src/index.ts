import { Structure, Maybe } from '@dapp-stack/environment'
import { soliditySourcePath } from '@dapp-stack/contract-utils'
import * as dockerode from 'dockerode'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Signale } from 'signale'

const docker = new dockerode()

const IMAGE_NAME = 'mythril/myth:latest'
const signale = new Signale({ scope: 'Security' })

export const run = async (contracts: Maybe<string[]> = false) => {
  if (!contracts) {
    contracts = soliditySourcePath()
  }

  const isDockerRunning: boolean = await pingDocker()
  if (!isDockerRunning) {
    signale.error(new Error('Docker is not running'))
    process.exit(1)
  }
  await downloadImage()
  signale.await('Running security checks')
  contracts.forEach(contract => runCheck(contract))
}

const pingDocker = async () => {
  try {
    await docker.ping()
    return true
  } catch {
    return false
  }
}

const runCheck = async function(contractName: string) {
  if (!fs.existsSync(contractName)) {
    signale.error(`File not found: ${contractName}`)
    return
  }

  const securityFile = path.join(
    Structure.contracts.security,
    contractName.replace('.sol', '.md')
  )
  await fs.ensureFile(securityFile)
  const stream = fs.createWriteStream(securityFile)
  const command = ['-o', 'markdown', '-x', `/solidity/src/${contractName}`]
  const options = { Binds: [`${Structure.contracts.src}:/solidity/src`] }
  return docker
    .run('mythril/myth', command, stream, options)
    .then(function(container) {
      return container.remove()
    })
}

const downloadImage = (): Promise<boolean> => {
  signale.await('Downloading docker image (it may take a while)...')

  return new Promise<boolean>(async (resolve, reject) => {
    docker.pull(IMAGE_NAME, {}, (err, stream) => {
      if (err) {
        return reject(err)
      }
      docker.modem.followProgress(stream, onFinished)
      function onFinished() {
        signale.success('Docker image downloaded')
        return resolve(true)
      }
    })
  })
}
