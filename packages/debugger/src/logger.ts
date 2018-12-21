import * as Debugger from 'truffle-debugger'
import * as OS from 'os'
import * as path from 'path'

import * as formatter from './formatter'
import { Location } from 'solidity-parser-antlr'

const { solidity, trace, session } = Debugger.selectors

interface Range {
  lines: Location
}

const commandReference: { [key: string]: string } = {
  o: 'step over',
  i: 'step into',
  u: 'step out',
  n: 'step next',
  ';': 'step instruction',
  p: 'print instruction',
  h: 'print this help',
  v: 'print variables and values',
  b: 'add breakpoint',
  B: 'remove breakpoint',
  c: 'continue until breakpoint',
  q: 'quit',
  r: 'reset'
}

export class Logger {
  constructor(private session: any) {}

  addressesAffected() {
    const affectedInstances = this.session.view(session.info.affectedInstances)

    console.log('Addresses affected:')
    console.log(affectedInstances)
  }

  help() {
    console.log('')

    const formatCommandDescription = function(commandId: string) {
      return '(' + commandId + ') ' + commandReference[commandId]
    }

    const prefix = ['Commands:']

    let commandSections = [
      ['o', 'i', 'u', 'n', ';'],
      ['p', 'h', 'q', 'r'],
      ['b', 'B', 'c'],
      ['v']
    ].map(function(shortcuts) {
      return shortcuts.map(formatCommandDescription).join(', ')
    })

    let suffix = ['']

    let lines = prefix.concat(commandSections).concat(suffix)

    console.log(lines.join(OS.EOL))
  }

  file() {
    let message = ''

    const sourcePath = this.session.view(solidity.current.source).sourcePath

    if (sourcePath) {
      message += path.basename(sourcePath)
    } else {
      message += '?'
    }

    console.log('')
    console.log(message + ':')
  }

  state() {
    let source: string = this.session.view(solidity.current.source).source
    let range: Range = this.session.view(solidity.current.sourceRange)

    if (!source) {
      console.log()
      console.log('1: // No source code found.')
      console.log('')
      return
    }

    let lines = source.split(/\r?\n/g)

    console.log('')

    console.log(formatter.formatRangeLines(lines, range.lines))

    console.log('')
  }

  async variables() {
    let variables = await this.session.variables()

    let longestNameLength = Math.max.apply(
      null,
      Object.keys(variables).map(name => name.length)
    )

    console.log()

    Object.keys(variables).forEach(name => {
      let paddedName = name + ':'

      while (paddedName.length <= longestNameLength) {
        paddedName = ' ' + paddedName
      }

      let value = variables[name]
      let formatted = formatter.formatValue(value, longestNameLength + 5)

      console.log('  ' + paddedName, formatted)
    })

    console.log()
  }

  instruction() {
    let instruction = this.session.view(solidity.current.instruction)
    let step = this.session.view(trace.step)
    let traceIndex = this.session.view(trace.index)

    console.log('')
    console.log(formatter.formatInstruction(traceIndex, instruction))
    console.log(formatter.formatStack(step.stack))
  }
}
