import { artifacts } from '@dapp-stack/contract-utils'
import * as repl from 'repl'
import * as Debugger from 'truffle-debugger'
import Web3 = require('web3')
import * as parser from 'solidity-parser-antlr'

import { Logger } from './logger'
import { Evaluator } from './evaluator'

export async function start(txHash: string) {
  const provider = new Web3('http://localhost:8545')
  const bugger = await Debugger.forTx(txHash, {
    contracts: getContracts(),
    provider
  })
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
  return artifacts().map(artifact => {
    const ast = parser.parse(artifact.source, { loc: true, range: true })
    return { ...artifact, ast }
  })
}
