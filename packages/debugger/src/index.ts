import { build, Structure } from '@dapp-stack/environment'
import * as repl from 'repl'
import * as Debugger from 'truffle-debugger'
import Web3 = require('web3')
import * as path from 'path'
import * as fs from 'fs-extra'
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
    prompt: `debug >`,
    eval: evaluator.run.bind(evaluator)
  })
}

function getContracts() {
  const environment = build()
  return environment.compile.contracts.map(name => {
    const data = fs.readJSONSync(
      path.join(Structure.contracts.build, name, 'SimpleStorage.json')
    )
    const sourcePath = path.join(Structure.contracts.src, name)
    const source = fs.readFileSync(sourcePath, 'utf-8')
    const ast = parser.parse(source, { loc: true, range: true })
    return {
      contractName: 'SimpleStorage',
      source,
      sourcePath,
      ast: ast,
      binary: data.evm.bytecode.object,
      sourceMap: data.evm.bytecode.sourceMap,
      deployedBinary: data.evm.deployedBytecode.object,
      deployedSourceMap: data.evm.deployedBytecode.sourceMap
    }
  })
}
