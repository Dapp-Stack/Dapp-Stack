import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Routes } from './routes';

const PORT = 55555;

export const start = () => {
  new App().start();
};

class App {
  public app: express.Application;
  public routesPrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routesPrv.routes(this.app);
  }

  start() {
    this.app.listen(PORT);
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}
