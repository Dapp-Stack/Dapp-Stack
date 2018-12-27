import * as Debugger from 'truffle-debugger'
import * as path from 'path'
import { Signale } from 'signale'
import { Location } from 'solidity-parser-antlr'

import * as formatter from './formatter'

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
  private signale: Signale

  constructor(private session: any) {
    this.signale = new Signale({ scope: 'Debugger' })
  }

  addressesAffected() {
    const affectedInstances = this.session.view(session.info.affectedInstances)

    this.signale.info('Addresses affected:')
    this.signale.info(affectedInstances)
    this.signale.info('')
  }

  help() {
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
    lines.map(line => this.signale.note(line))
    this.signale.note('')
  }

  file() {
    let message = ''

    const sourcePath = this.session.view(solidity.current.source).sourcePath

    if (sourcePath) {
      message += path.basename(sourcePath)
    } else {
      message += '?'
    }
    this.signale.info('')
    this.signale.info(message + ':')
    this.signale.info('')
  }

  state() {
    let source: string = this.session.view(solidity.current.source).source
    let range: Range = this.session.view(solidity.current.sourceRange)

    if (!source) {
      this.signale.pending('')
      this.signale.pending('1: // No source code found.')
      this.signale.pending('')
      return
    }

    let lines = source.split(/\r?\n/g)

    this.signale.info('')
    formatter
      .formatRangeLines(lines, range.lines)
      .forEach(line => this.signale.info(line))
    this.signale.info('')
  }

  async variables() {
    let variables = await this.session.variables()

    let longestNameLength = Math.max.apply(
      null,
      Object.keys(variables).map(name => name.length)
    )

    this.signale.info('')
    Object.keys(variables).forEach(name => {
      let paddedName = name + ':'

      while (paddedName.length <= longestNameLength) {
        paddedName = ' ' + paddedName
      }

      let value = variables[name]
      let formatted = formatter.formatValue(value, longestNameLength + 5)

      this.signale.info('  ' + paddedName, formatted)
    })

    this.signale.info('')
  }

  instruction() {
    let instruction = this.session.view(solidity.current.instruction)
    let step = this.session.view(trace.step)
    let traceIndex = this.session.view(trace.index)

    this.signale.debug('')
    this.signale.debug(formatter.formatInstruction(traceIndex, instruction))
    this.signale.debug(formatter.formatStack(step.stack))
    this.signale.debug('')
  }
}
