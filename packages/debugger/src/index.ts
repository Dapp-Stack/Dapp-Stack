import { artifacts } from '@dapp-stack/contract-utils'
import * as repl from 'repl'
import * as Debugger from 'truffle-debugger'
import * as parser from 'solidity-parser-antlr'
import { Signale } from 'signale'
import Web3 = require('web3')

import { Logger } from './logger'
import { Evaluator } from './evaluator'

const signale = new Signale({ scope: 'Debugger' })

export async function start(txHash: string) {
  const provider = new Web3('http://localhost:8545')
  let bugger
  try {
    bugger = await Debugger.forTx(txHash, {
      contracts: getContracts(),
      provider
    })
  } catch (error) {
    signale.error(
      'We could not start the debugger, make sure the transaction hash is correct.'
    )
    process.exit(1)
  }
  const session = await bugger.connect()
  const logger = new Logger(session)
  const evaluator = new Evaluator(session, logger)

  logger.addressesAffected()
  logger.help()
  logger.file()
  logger.state()

  repl.start({
    prompt: `debug (${txHash})>`,
    eval: evaluator.run.bind(evaluator)
  })
}

function getContracts() {
  return artifacts()
    .filter(artifact => artifact.contractName.endsWith('.sol'))
    .map(artifact => {
      const ast = parser.parse(artifact.source, { loc: true, range: true })
      return { ...artifact, ast }
    })
}
