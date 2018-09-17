import * as fs from 'fs';
import * as path from 'path';

export class GanacheFileLogger {
  private logStream: fs.WriteStream;

  constructor() {
    this.logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'ganache.log'));
  }

  log = (message: string): void => {
    this.logStream.write(`${message}\n`);
  }
}