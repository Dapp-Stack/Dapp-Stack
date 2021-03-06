import { Logger } from './logger'
import * as Debugger from 'truffle-debugger'
import { Signale } from 'signale'

interface Breakpoint {
  node?: number
  line?: number
  sourceId?: number
}

const { solidity, trace, session, controller } = Debugger.selectors

export class Evaluator {
  private lastCommand: string = ''
  private signale: Signale

  constructor(private session: any, private logger: Logger) {
    this.signale = new Signale({ scope: 'Debugger' })
  }

  async run(
    cmd: string,
    _context: any,
    _filename: any,
    callback: (err: Error | null, result: any) => void
  ) {
    cmd = cmd.trim()

    if (cmd === '.exit') {
      cmd = 'q'
    }

    const args = cmd.split(/ +/).slice(1)
    cmd = cmd.split(/ +/)[0]

    if (cmd === '') {
      cmd = this.lastCommand
    }

    if (cmd === 'q') {
      process.exit()
    }

    const alreadyFinished = this.session.view(trace.finished)

    if (!alreadyFinished) {
      switch (cmd) {
        case 'o':
          this.session.stepOver()
          break
        case 'i':
          this.session.stepInto()
          break
        case 'u':
          this.session.stepOut()
          break
        case 'n':
          this.session.stepNext()
          break
        case ';':
          this.session.advance()
          break
        case 'c':
          this.session.continueUntilBreakpoint()
          break
      }
    } else {
      switch (cmd) {
        case 'o':
        case 'i':
        case 'u':
        case 'n':
        case ';':
        case 'c':
          this.signale.info('Transaction has halted; cannot advance.')
      }
    }
    if (cmd === 'r') {
      this.session.reset()
    }

    if (this.session.view(trace.finished) && !alreadyFinished) {
      if (!this.session.view(session.transaction.receipt).status) {
        this.signale.error('Transaction halted with a RUNTIME ERROR.')
        this.signale.error('')
        this.signale.error(
          `This is likely due to an intentional halting expression, like assert(), require() or revert(). 
          It can also be due to out-of-gas exceptions. Please inspect your transaction parameters and contract
          code to determine the meaning of this error.`
        )
      } else {
        this.signale.success('Transaction completed successfully.')
      }
    }

    switch (cmd) {
      case 'v':
        await this.logger.variables()
        break
      case 'b':
        this.setOrClearBreakpoint(args, true)
        break
      case 'B':
        this.setOrClearBreakpoint(args, false)
        break
      case ';':
      case 'p':
        this.logger.file()
        this.logger.instruction()
        this.logger.state()
        break
      case 'o':
      case 'i':
      case 'u':
      case 'n':
      case 'c':
        if (!this.session.view(trace.finished)) {
          if (!this.session.view(solidity.current.source).source) {
            this.logger.instruction()
          }

          this.logger.file()
          this.logger.state()
        }
        break
      case 'r':
        this.logger.addressesAffected()
        this.logger.file()
        this.logger.state()
        break
      default:
        this.logger.help()
    }

    if (
      cmd !== 'i' &&
      cmd !== 'u' &&
      cmd !== 'b' &&
      cmd !== 'B' &&
      cmd !== 'v' &&
      cmd !== 'h' &&
      cmd !== 'p' &&
      cmd !== ';' &&
      cmd !== 'r'
    ) {
      this.lastCommand = cmd
    }
    callback(null, '')
  }

  setOrClearBreakpoint(args: string[], setOrClear: boolean) {
    const currentLocation = this.session.view(controller.current.location)
    const breakpoints: Breakpoint[] = this.session.view(controller.breakpoints)

    if (!currentLocation.node) {
      this.signale.error(
        'No source found, we cannot use breakpoint in such case.'
      )
      return
    }

    const currentNode: number = currentLocation.node.id
    const currentLine: number = currentLocation.sourceRange.lines.start.line
    const currentSourceId: number = currentLocation.source.id

    let sourceName

    let breakpoint: Breakpoint = {}

    if (!args[0]) {
      breakpoint.node = currentNode
      breakpoint.line = currentLine
      breakpoint.sourceId = currentSourceId
    } else {
      const line = parseInt(args[0], 10)

      if (isNaN(line)) {
        this.signale.error('Line number must be an integer.')
        return
      }

      breakpoint.sourceId = currentSourceId
      breakpoint.line = line - 1
    }

    let locationMessage
    if (breakpoint.node !== undefined) {
      locationMessage = `this point in line ${breakpoint.line + 1}`
    } else if (breakpoint.sourceId !== currentSourceId) {
      locationMessage = `line ${breakpoint.line + 1} in ${sourceName}`
    } else {
      locationMessage = `line ${breakpoint.line + 1}`
    }

    let alreadyExists =
      breakpoints.filter(
        existingBreakpoint =>
          existingBreakpoint.sourceId === breakpoint.sourceId &&
          existingBreakpoint.line === breakpoint.line &&
          existingBreakpoint.node === breakpoint.node
      ).length > 0

    if (setOrClear === alreadyExists) {
      if (setOrClear) {
        this.signale.info(`Breakpoint at ${locationMessage} already exists.`)
        return
      } else {
        this.signale.info(`No breakpoint at ${locationMessage} to remove.`)
        return
      }
    }

    if (setOrClear) {
      this.session.addBreakpoint(breakpoint)
      this.signale.success(`Breakpoint added at ${locationMessage}.`)
    } else {
      this.session.removeBreakpoint(breakpoint)
      this.signale.success(`Breakpoint removed at ${locationMessage}.`)
    }
    return
  }
}
