import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as http from 'http'

import { Routes } from './routes'

const PORT = 55555

const corsOptions = {
  origin: ['http://localhost:3000', 'https://dev-tools.dapp-stack.org']
}

export const start = async () => {
  const isRunning = await ping()
  if (isRunning) {
    return
  }
  new App().start()
}

const ping = () => {
  return new Promise<boolean>(resolve => {
    http
      .get(`http://127.0.0.1:${PORT}/`, res => {
        resolve(true)
      })
      .on('error', () => {
        resolve(false)
      })
  })
}

class App {
  public app: express.Application
  public routesPrv: Routes = new Routes()

  constructor() {
    this.app = express()
    this.config()
    this.routesPrv.routes(this.app)
  }

  start() {
    this.app.listen(PORT)
  }

  private config(): void {
    this.app.use(cors(corsOptions))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
  }
}
