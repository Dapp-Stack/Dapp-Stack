import { Structure } from '@dapp-stack/environment'
import * as crypto from 'crypto'
import * as fs from 'fs-extra'
import * as generator from 'generate-password'
import { Signale } from 'signale'

const opn = require('opn')
const ALGORITHM = 'aes-256-ctr'

const signale = new Signale({ scope: 'Secrets' })

export const setup = () => {
  signale.await('Generate password')
  const password = generatePassword()
  fs.writeFileSync(Structure.masterKey, password)

  signale.await('Encrypt secrets')
  const text = encrypt(JSON.stringify({}))
  fs.writeFileSync(Structure.secrets, text)
  signale.success('Secrets setup successfully')
}

export const edit = async () => {
  const filename = `${Structure.secrets}.${process.pid}.json`
  try {
    const content = decrypt()
    fs.writeFileSync(filename, content)

    signale.await('Opening editor')
    await opn(filename)

    const updatedContent = fs.readFileSync(filename, 'utf-8')
    if (updatedContent !== content) {
      fs.writeFileSync(Structure.secrets, encrypt(updatedContent))
    }
  } catch (error) {
    signale.error(error)
  } finally {
    fs.removeSync(filename)
    signale.success('Secrets updated')
  }
}

export const show = () => {
  const content = decrypt()
  console.log(content)
}

export const decrypt = () => {
  const password = getPassword()
  const text = getText()
  const [iv, encryptedText] = text.split(':')
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    password,
    Buffer.from(iv, 'hex')
  )
  let dec = decipher.update(encryptedText, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16)
  const password = getPassword()
  const cipher = crypto.createCipheriv(ALGORITHM, password, iv)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return iv.toString('hex') + ':' + crypted
}

const generatePassword = () => {
  return generator.generate({
    length: 32,
    numbers: true
  })
}

const getPassword = () => {
  if (fs.existsSync(Structure.masterKey)) {
    return fs.readFileSync(Structure.masterKey, 'utf-8')
  }

  return process.env.MASTER_KEY || ''
}

const getText = () => {
  if (!fs.existsSync(Structure.secrets)) {
    return ''
  }

  return fs.readFileSync(Structure.secrets, 'utf-8')
}
