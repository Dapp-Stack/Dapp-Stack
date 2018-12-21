import * as OS from 'os'
import { Location } from 'solidity-parser-antlr'
import * as util from 'util'

export function formatInstruction(
  traceIndex: number,
  instruction: { name: string; pushData?: string }
) {
  return (
    '(' +
    traceIndex +
    ') ' +
    instruction.name +
    ' ' +
    (instruction.pushData || '')
  )
}

export function formatStack(stack: string[]) {
  let formatted = stack.map((item, index) => {
    item = '  ' + item
    if (index === stack.length - 1) {
      item += ' (top)'
    }

    return item
  })

  if (stack.length === 0) {
    formatted.push('  No data on stack.')
  }

  return formatted.join(OS.EOL)
}

export function formatValue(value: string, indent: number) {
  if (!indent) {
    indent = 0
  }

  return util
    .inspect(value, {
      colors: true,
      depth: null,
      breakLength: 30
    })
    .split(/\r?\n/g)
    .map(function(line, i) {
      // don't indent first line
      let padding = i > 0 ? Array(indent).join(' ') : ''
      return padding + line
    })
    .join(OS.EOL)
}

export function formatRangeLines(source: string[], range: Location) {
  const startBeforeIndex = Math.max(range.start.line - 2, 0)
  const endAfterIndex = Math.min(range.start.line + 3, source.length)
  const prefixLength = (range.start.line + 1 + '').length

  const beforeLines = source
    .filter((line, index) => {
      return index >= startBeforeIndex && index < range.start.line
    })
    .map((line, index) => {
      let n = startBeforeIndex + index + 1
      return formatLineNumberPrefix(line, n, prefixLength)
    })

  const afterLines = source
    .filter((line, index) => {
      return index <= endAfterIndex && index > range.start.line
    })
    .map((line, index) => {
      let n = range.start.line + index + 2
      return formatLineNumberPrefix(line, n, prefixLength)
    })

  const line = source[range.start.line]
  const n = range.start.line + 1

  const pointerStart = range.start.column
  let pointerEnd

  if (range.end && range.start.line === range.end.line) {
    pointerEnd = range.end.column
  } else {
    pointerEnd = line.length
  }

  let allLines = beforeLines
    .concat([
      formatLineNumberPrefix(line, n, prefixLength),
      formatLinePointer(line, pointerStart, pointerEnd, prefixLength)
    ])
    .concat(afterLines)

  return allLines
}

export function formatLineNumberPrefix(line: string, n: number, cols: number) {
  const tab = '  '

  let prefix = n + ''
  while (prefix.length < cols) {
    prefix = ' ' + prefix
  }

  prefix += ': '
  return prefix + line.replace(/\t/g, tab)
}

export function formatLinePointer(
  line: string,
  startCol: number,
  endCol: number,
  padding: number
) {
  const tab = '  '

  padding += 2
  let prefix = ''
  while (prefix.length < padding) {
    prefix += ' '
  }

  let output = ''
  for (let i = 0; i < line.length; i++) {
    let pointedAt = i >= startCol && i < endCol
    let isTab = line[i] === '\t'

    let additional
    if (isTab) {
      additional = tab
    } else {
      additional = ' '
    }

    if (pointedAt) {
      additional = additional.replace(/./g, '^')
    }

    output += additional
  }

  return prefix + output
}
