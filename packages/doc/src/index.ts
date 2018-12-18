import { build, Structure, Maybe } from '@dapp-stack/environment'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as sha1File from 'sha1-file'
import { Signale } from 'signale'
import * as parser from 'solidity-parser-antlr'

const signale = new Signale({ scope: 'Doc' })

export const runAll = (contracts: Maybe<string[]> = false) => {
  if (!contracts) {
    contracts = build().compile.contracts
  }

  contracts
    .filter(contract => contract.endsWith('.sol'))
    .map(contract => path.join(Structure.contracts.src, contract))
    .forEach(contractFile => run(contractFile))
}

export const run = async (contractFile: string) => {
  if (!fs.existsSync(contractFile)) {
    signale.error(`File not found: ${contractFile}`)
    return
  }

  const outFile = path.join(
    Structure.contracts.doc,
    `${path.basename(contractFile, '.sol')}.md`
  )
  await fs.ensureFile(outFile)

  let filesTable = `
|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
`

  let contractsTable = `
|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
`

  filesTable += `| ${contractFile} | ${sha1File(contractFile)} |
`

  const content = fs.readFileSync(contractFile).toString('utf-8')
  const ast = parser.parse(content, {})

  parser.visit(ast, {
    ContractDefinition(node) {
      const name = node.name
      const bases = node.baseContracts
        .map(spec => {
          return spec.baseName.namePath
        })
        .join(', ')

      let specs = ''
      if (node.kind === 'library') {
        specs += 'Library'
      } else if (node.kind === 'interface') {
        specs += 'Interface'
      } else {
        specs += 'Implementation'
      }

      contractsTable += `||||||
| **${name}** | ${specs} | ${bases} |||
`
    },

    FunctionDefinition(node) {
      let name

      if (node.isConstructor) {
        name = '\\<Constructor\\>'
      } else if (!node.name) {
        name = '\\<Fallback\\>'
      } else {
        name = node.name
      }

      let spec = ''
      if (node.visibility === 'public' || node.visibility === 'default') {
        spec += 'Public ❗️'
      } else if (node.visibility === 'external') {
        spec += 'External ❗️'
      } else if (node.visibility === 'private') {
        spec += 'Private 🔐'
      } else if (node.visibility === 'internal') {
        spec += 'Internal 🔒'
      }

      let payable = ''
      if (node.stateMutability === 'payable') {
        payable = '💵'
      }

      let mutating = ''
      if (!node.stateMutability) {
        mutating = '🛑'
      }

      contractsTable += `| └ | ${name} | ${spec} | ${mutating} ${payable} |`
    },

    'FunctionDefinition:exit'(node) {
      contractsTable += ` |
`
    },

    ModifierInvocation(node) {
      contractsTable += ` ${node.name}`
    }
  })

  const reportContents = `## Dapp's Description Report
### Files Description Table
${filesTable}
### Contracts Description Table
${contractsTable}
### Legend
|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
`

  try {
    fs.writeFileSync(outFile, reportContents, { flag: 'w' })
  } catch (error) {
    signale.error(error)
  }
}
