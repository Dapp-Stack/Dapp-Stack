import { Request, Response, Application } from 'express'
import { Controllers } from './controllers'

export class Routes {
  public controllers: Controllers = new Controllers()

  public routes = (app: Application): void => {
    app.route('/ping').get(this.controllers.ping)
    app.route('/tracker').get(this.controllers.getTracker)
  }
}
